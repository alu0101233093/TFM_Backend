import request from 'supertest';
import expressApp, { auth, database } from '../../src/app';
import { verifyIdTokenResponse, verificationRequest, verifyAdminIdTokenResponse } from '../mockResponses/mockAuthResponses'
import { verificationRequests } from '../mockResponses/mockDatabaseResponse'

jest.mock('../../src/services/FirebaseAuth', () => {
    return {
        FirebaseAuth: jest.fn(() => ({
            verifyIdToken: jest.fn(),
            changeUserRole: jest.fn()
        }))
    };
})

jest.mock('../../src/services/FirebaseRTDB', () => {
    return {
        FirebaseRTDB: jest.fn(() => ({
            deleteUserReviews: jest.fn(),
            setVerificationRequest: jest.fn(),
            getVerificationRequests: jest.fn(),
            updateRequestStatus: jest.fn()
        }))
    };
});

describe('POST /verification', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('Should return code 400 Bad request. Text request required.', async () => {
        const response = await request(expressApp)
            .post('/verification')
            .send({});
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ name: 'Bad request. Text request required.' });
    });

    test('Should return code 400 Bad request. IdToken not found on request', async () => {
        const response = await request(expressApp)
            .post('/verification')
            .send(verificationRequest);
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ name: 'IdToken not found on request' });
    });

    test('Should return code 401 Unauthorized', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockRejectedValueOnce('Invalid IdToken');
        const response = await request(expressApp)
            .post('/verification')
            .set('Authorization', 'Bearer InvalidTokenID')
            .send(verificationRequest);
        
        expect(authSpy).toHaveBeenCalled();
        expect(response.status).toBe(401);
    });

    test('Should return code 500 Error saving request', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        const databaseSpy = jest.spyOn(database, 'setVerificationRequest').mockRejectedValueOnce('Error saving request in database');
        const response = await request(expressApp)
            .post('/verification')
            .set('Authorization', 'Bearer ValidTokenID')
            .send(verificationRequest);
        
        expect(authSpy).toHaveBeenCalled();
        expect(databaseSpy).toHaveBeenCalled();
        expect(response.status).toBe(500);
    });

    test('Should return code 201 and save the request successfully', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        const databaseSpy = jest.spyOn(database, 'setVerificationRequest').mockResolvedValueOnce('RequestID123');
        const response = await request(expressApp)
            .post('/verification')
            .set('Authorization', 'Bearer ValidTokenID')
            .send(verificationRequest);
        
        expect(authSpy).toHaveBeenCalled();
        expect(databaseSpy).toHaveBeenCalled();
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'Saved request with ID: RequestID123' });
    });
});

describe('GET /verification', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('Should return code 400 Bad request. IdToken not found on request', async () => {
        const response = await request(expressApp)
            .get('/verification')
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ name: 'IdToken not found on request' });
    });

    test('Should return code 401 Unauthorized', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockRejectedValueOnce('Invalid IdToken');
        const response = await request(expressApp)
            .get('/verification')
            .set('Authorization', 'Bearer InvalidTokenID');
        
        expect(authSpy).toHaveBeenCalled();
        expect(response.status).toBe(401);
    });

    test('Should return code 403 Forbidden. User is not an administrator', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        const response = await request(expressApp)
            .get('/verification')
            .set('Authorization', 'Bearer ValidTokenID');
        
        expect(authSpy).toHaveBeenCalled();
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ name: 'User logged is not an administrator.' });
    });

    test('Should return code 400 Error fetching verification requests', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyAdminIdTokenResponse);
        const databaseSpy = jest.spyOn(database, 'getVerificationRequests').mockRejectedValueOnce('Error fetching requests');

        const response = await request(expressApp)
            .get('/verification')
            .set('Authorization', 'Bearer ValidTokenID');
        
        expect(authSpy).toHaveBeenCalled();
        expect(databaseSpy).toHaveBeenCalled();
        expect(response.status).toBe(400);
    });

    test('Should return code 200 and list of verification requests', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyAdminIdTokenResponse);
        const databaseSpy = jest.spyOn(database, 'getVerificationRequests').mockResolvedValueOnce(verificationRequests);

        const response = await request(expressApp)
            .get('/verification')
            .set('Authorization', 'Bearer ValidTokenID');
        
        expect(authSpy).toHaveBeenCalled();
        expect(databaseSpy).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual(verificationRequests);
    });
});

describe('PATCH /verification', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('Should return code 400 Bad request. IdToken not found on request', async () => {
        const response = await request(expressApp)
            .patch('/verification')
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ name: 'IdToken not found on request' });
    });

    test('Should return code 401 Unauthorized. User is not an administrator', async () => {
        const authSpy = jest.spyOn(auth, 'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        const response = await request(expressApp)
            .patch('/verification')
            .set('Authorization', 'Bearer ValidTokenID')
        
        expect(authSpy).toHaveBeenCalled();
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ name: 'User logged is not an administrator.' });
    });

    test('Should return code 401 Unauthorized. Invalid admin IdToken.', async () => {
        const authSpy = jest.spyOn(auth, 'verifyIdToken').mockRejectedValueOnce('Invalid admin IdToken.');
        const response = await request(expressApp)
            .patch('/verification')
            .set('Authorization', 'Bearer InvalidTokenID')
        
        expect(authSpy).toHaveBeenCalled();
        expect(response.status).toBe(401);
    });

    test('Should return code 400 Bad request. RequestID or newStatus not provided', async () => {
        const authSpy = jest.spyOn(auth, 'verifyIdToken').mockResolvedValueOnce(verifyAdminIdTokenResponse);
        const response = await request(expressApp)
            .patch('/verification')
            .set('Authorization', 'Bearer ValidTokenID')
            .send({})
        
        expect(authSpy).toHaveBeenCalled();
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ name: 'Bad request. RequestID or newStatus not provided.' });
    });

    test('Should return code 400 Error updating request status', async () => {
        const authSpy = jest.spyOn(auth, 'verifyIdToken').mockResolvedValueOnce(verifyAdminIdTokenResponse);
        const databaseSpy = jest.spyOn(database, 'updateRequestStatus').mockRejectedValueOnce('Error updating request status');
        const response = await request(expressApp)
            .patch('/verification')
            .set('Authorization', 'Bearer ValidTokenID')
            .send({ requestID: 'request-id', newStatus: 'Approved' })
        
        expect(authSpy).toHaveBeenCalled();
        expect(databaseSpy).toHaveBeenCalled();
        expect(response.status).toBe(400);
    });

    test('Should return code 500 Error changing user role', async () => {
        const authSpy = jest.spyOn(auth, 'verifyIdToken').mockResolvedValueOnce(verifyAdminIdTokenResponse);
        const databaseSpy = jest.spyOn(database, 'updateRequestStatus').mockResolvedValueOnce('user-uid');
        const authSpy2 = jest.spyOn(auth, 'changeUserRole').mockRejectedValueOnce('Error changing user role');
        const response = await request(expressApp)
            .patch('/verification')
            .set('Authorization', 'Bearer ValidTokenID')
            .send({ requestID: 'request-id', newStatus: 'Approved' })
        
        expect(authSpy).toHaveBeenCalled();
        expect(databaseSpy).toHaveBeenCalled();
        expect(authSpy2).toHaveBeenCalled();
        expect(response.status).toBe(500);
    });

    test('Should return code 200 User role changed successfully', async () => {
        const authSpy = jest.spyOn(auth, 'verifyIdToken').mockResolvedValueOnce(verifyAdminIdTokenResponse);
        const databaseSpy = jest.spyOn(database, 'updateRequestStatus').mockResolvedValueOnce('user-uid');
        const authSpy2 = jest.spyOn(auth, 'changeUserRole').mockResolvedValueOnce('User role changed');
        const response = await request(expressApp)
            .patch('/verification')
            .set('Authorization', 'Bearer ValidTokenID')
            .send({ requestID: 'request-id', newStatus: 'Approved' })
        
        expect(authSpy).toHaveBeenCalled();
        expect(databaseSpy).toHaveBeenCalled();
        expect(authSpy2).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'User role changed successfully' });
    });
});