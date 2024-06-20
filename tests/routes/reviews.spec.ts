import request from 'supertest';
import expressApp, { auth, database } from '../../src/app';

jest.mock('../../src/services/FirebaseAuth', () => {
    return {
        FirebaseAuth: jest.fn(() => ({
            verifyIdToken: jest.fn()
        }))
    };
})

jest.mock('../../src/services/FirebaseRTDB', () => {
    return {
        FirebaseRTDB: jest.fn(() => ({
            setReview: jest.fn()
        }))
    };
});

describe('POST /reviews', () => {

    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterAll(() => {
        jest.restoreAllMocks()
    })

    test('Should return code 400 without Authorization header', async () => {
        const response = await request(expressApp)
            .post('/reviews')
            .send();

        expect(response.status).toBe(400);
    });

    test('Should return code 400 without movie_id', async () => {
        jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce({
            uid: 'user uid',
            picture: 'user photo',
            email_verified: false
        } as any);
        
        const response = await request(expressApp)
            .post('/reviews')
            .set('Authorization', 'Valid TokenID')
        expect(response.status).toBe(400);
    });

    test('Should return code 401 Unauthorized', async () => {
        jest.spyOn(auth,'verifyIdToken').mockRejectedValueOnce('Invalid TokenID')
        
        const response = await request(expressApp)
            .post('/reviews')
            .set('Authorization', 'Invalid TokenID')
            .query({ movie_id: 558 });
            
        expect(response.status).toBe(401);
    });

    test('Should return code 201', async () => {
        jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce({
            uid: 'user uid 2',
            picture: 'user photo 2',
            email_verified: false
        } as any);

        jest.spyOn(database,'setReview').mockResolvedValueOnce('review ID');

        const response = await request(expressApp)
            .post('/reviews')
            .set('Authorization', 'Valid TokenID')
            .query({ movie_id: 558 });

        expect(response.status).toBe(201);
    });
});
