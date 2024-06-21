import request from 'supertest';
import expressApp, { auth, storage, database } from '../../src/app';
import { signUpUserBadRequest, signUpUserRequest, verifyIdTokenResponse } from '../mockResponses/mockAuthResponses'

jest.mock('../../src/services/FirebaseAuth', () => {
    return {
        FirebaseAuth: jest.fn(() => ({
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            verifyIdToken: jest.fn()
        }))
    };
})

jest.mock('../../src/services/FirebaseRTDB', () => {
    return {
        FirebaseRTDB: jest.fn(() => ({
            deleteUserReviews: jest.fn(),
            setVerificationRequest: jest.fn()
        }))
    };
});

jest.mock('../../src/services/FirebaseStr', () => {
    return {
        FirebaseStr: jest.fn(() => ({
            savePicture: jest.fn(),
            deleteProfilePic: jest.fn()
        }))
    };
});

describe('POST /users/signUp', () => {

    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterAll(() => {
        jest.restoreAllMocks()
    })

    test('Should return code 400 Bad request', async () => {
        const response = await request(expressApp)
            .post('/users/signUp')
            .field(signUpUserBadRequest)
        
        expect(response.status).toBe(400);
    });

    test('Should return code 500 Error creating user in firebase auth', async () => {
        const authSpy = jest.spyOn(auth, 'createUser').mockRejectedValueOnce('Error creating user in firebase auth ')
        const response = await request(expressApp)
            .post('/users/signUp')
            .field(signUpUserRequest);
        
        expect(authSpy).toHaveBeenCalled()
        expect(response.status).toBe(500);
    });

    test('Should return code 500 Error uploading image in firebase storage', async () => {
        const authSpy = jest.spyOn(auth, 'createUser').mockResolvedValueOnce({uid: 'User Identification'} as any)
        const storageSpy = jest.spyOn(storage, 'savePicture').mockRejectedValueOnce('Error uploading image in firebase storage')
        const response = await request(expressApp)
            .post('/users/signUp')
            .field(signUpUserRequest);
        
        expect(authSpy).toHaveBeenCalled()
        expect(storageSpy).toHaveBeenCalled()
        expect(response.status).toBe(500);
    });

    test('Should return code 500 Error updating photo URL in firabase Auth', async () => {
        const authSpy = jest.spyOn(auth, 'createUser').mockResolvedValueOnce({uid: 'User Identification'} as any)
        const storageSpy = jest.spyOn(storage, 'savePicture').mockResolvedValueOnce('Profile photo URL')
        const authSpy2 = jest.spyOn(auth, 'updateUser').mockRejectedValueOnce('Error updating photo URL in firabase Auth')
        
        const response = await request(expressApp)
            .post('/users/signUp')
            .field(signUpUserRequest);
        
        expect(authSpy).toHaveBeenCalled()
        expect(storageSpy).toHaveBeenCalled()
        expect(authSpy2).toHaveBeenCalled()
        expect(response.status).toBe(500);
    });

    test('Should return code 201 User created', async () => {
        const authSpy = jest.spyOn(auth, 'createUser').mockResolvedValueOnce({uid: 'User Identification'} as any)
        const storageSpy = jest.spyOn(storage, 'savePicture').mockResolvedValueOnce('Profile photo URL')
        const authSpy2 = jest.spyOn(auth, 'updateUser').mockResolvedValueOnce({uid: 'User Identification'} as any)
        
        const response = await request(expressApp)
            .post('/users/signUp')
            .field(signUpUserRequest);
        
        expect(authSpy).toHaveBeenCalled()
        expect(storageSpy).toHaveBeenCalled()
        expect(authSpy2).toHaveBeenCalled()
        expect(response.status).toBe(201);
    });
});

describe('PUT /users/updateData', () => {

    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterAll(() => {
        jest.restoreAllMocks()
    })

    test('Should return code 400 Bad request. From data not provided', async () => {
        const response = await request(expressApp)
            .put('/users/updateData')
            .field(signUpUserBadRequest)
        
        expect(response.status).toBe(400);
    });

    test('Should return code 400 Bad request. IdToken not provided', async () => {
        const fileContent = Buffer.from('This is a test file');
        const response = await request(expressApp)
            .put('/users/updateData')
            .field(signUpUserRequest)
            .attach('photo', fileContent, 'test file');
        
        expect(response.status).toBe(400);
    });

    test('Should return code 401 Unauthorized', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockRejectedValueOnce('Invalid IdToken');
        const fileContent = Buffer.from('This is a test file');
        const response = await request(expressApp)
            .put('/users/updateData')
            .set('Authorization', 'Valid TokenID')
            .field(signUpUserRequest)
            .attach('photo', fileContent,'test file');
        
        expect(authSpy).toHaveBeenCalled()
        expect(response.status).toBe(401);
    });

    test('Should return code 500 Error saving new photo', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        const storageSpy = jest.spyOn(storage, 'savePicture').mockRejectedValueOnce('Error uploading image in firebase storage')
        const fileContent = Buffer.from('This is a test file');
        const response = await request(expressApp)
            .put('/users/updateData')
            .set('Authorization', 'Valid TokenID')
            .field(signUpUserRequest)
            .attach('photo', fileContent, 'test file');
        
        expect(authSpy).toHaveBeenCalled()
        expect(storageSpy).toHaveBeenCalled()
        expect(response.status).toBe(500);
    });

    test('Should return code 500 Error updating user data with file given.', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        const storageSpy = jest.spyOn(storage, 'savePicture').mockResolvedValueOnce('Profile photo URL');
        const authSpy2 = jest.spyOn(auth,'updateUser').mockRejectedValueOnce('Updating new photo URL failed.');
        const fileContent = Buffer.from('This is a test file');
        const response = await request(expressApp)
            .put('/users/updateData')
            .set('Authorization', 'Valid TokenID')
            .field(signUpUserRequest)
            .attach('photo', fileContent, 'test file');
        
        expect(authSpy).toHaveBeenCalled();
        expect(storageSpy).toHaveBeenCalled();
        expect(authSpy2).toHaveBeenCalled();
        expect(response.status).toBe(500);
    });

    test('Should return code 200 with file given.', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        const storageSpy = jest.spyOn(storage, 'savePicture').mockResolvedValueOnce('Profile photo URL');
        const authSpy2 = jest.spyOn(auth,'updateUser').mockResolvedValueOnce({uid: 'User Identification'} as any);
        const fileContent = Buffer.from('This is a test file');
        const response = await request(expressApp)
            .put('/users/updateData')
            .set('Authorization', 'Valid TokenID')
            .field(signUpUserRequest)
            .attach('photo', fileContent, 'test file');
        
        expect(authSpy).toHaveBeenCalled();
        expect(storageSpy).toHaveBeenCalled();
        expect(authSpy2).toHaveBeenCalled();
        expect(response.status).toBe(200);
    });
    
    test('Should return code 500 Error updating user data without file given.', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        const authSpy2 = jest.spyOn(auth,'updateUser').mockRejectedValueOnce('Updating new photo URL failed.');
        const response = await request(expressApp)
            .put('/users/updateData')
            .set('Authorization', 'Valid TokenID')
            .field(signUpUserRequest)
        
        expect(authSpy).toHaveBeenCalled();
        expect(authSpy2).toHaveBeenCalled();
        expect(response.status).toBe(500);
    });

    test('Should return code 200 without file given.', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        const authSpy2 = jest.spyOn(auth,'updateUser').mockResolvedValueOnce({uid: 'User Identification'} as any);
        const response = await request(expressApp)
            .put('/users/updateData')
            .set('Authorization', 'Valid TokenID')
            .field(signUpUserRequest)
        
        expect(authSpy).toHaveBeenCalled();
        expect(authSpy2).toHaveBeenCalled();
        expect(response.status).toBe(200);
    });
});

describe('DELETE /users', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('Should return code 400 Bad request. IdToken not found on request', async () => {
        const response = await request(expressApp)
            .delete('/users')
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ name: 'IdToken not found on request' });
    });

    test('Should return code 401 Unauthorized', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockRejectedValueOnce('Invalid IdToken');
        const response = await request(expressApp)
            .delete('/users')
            .set('Authorization', 'Bearer InvalidTokenID');
        
        expect(authSpy).toHaveBeenCalled();
        expect(response.status).toBe(401);
    });

    test('Should return code 500 Error deleting user data', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        const deleteUserSpy = jest.spyOn(auth, 'deleteUser').mockRejectedValueOnce('Error deleting user');
        const deleteProfilePicSpy = jest.spyOn(storage, 'deleteProfilePic').mockResolvedValueOnce(undefined);
        const deleteUserReviewsSpy = jest.spyOn(database, 'deleteUserReviews').mockResolvedValueOnce(undefined);

        const response = await request(expressApp)
            .delete('/users')
            .set('Authorization', 'Bearer ValidTokenID');
        
        expect(authSpy).toHaveBeenCalled();
        expect(deleteUserSpy).toHaveBeenCalled();
        expect(deleteProfilePicSpy).toHaveBeenCalled();
        expect(deleteUserReviewsSpy).toHaveBeenCalled();
        expect(response.status).toBe(500);
    });

    test('Should return code 500 Error deleting user profile picture', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        const deleteUserSpy = jest.spyOn(auth, 'deleteUser').mockResolvedValueOnce(undefined);
        const deleteProfilePicSpy = jest.spyOn(storage, 'deleteProfilePic').mockRejectedValueOnce('Error deleting profile picture');
        const deleteUserReviewsSpy = jest.spyOn(database, 'deleteUserReviews').mockResolvedValueOnce(undefined);

        const response = await request(expressApp)
            .delete('/users')
            .set('Authorization', 'Bearer ValidTokenID');
        
        expect(authSpy).toHaveBeenCalled();
        expect(deleteUserSpy).toHaveBeenCalled();
        expect(deleteProfilePicSpy).toHaveBeenCalled();
        expect(deleteUserReviewsSpy).toHaveBeenCalled();
        expect(response.status).toBe(500);
    });

    test('Should return code 500 Error deleting user reviews', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        const deleteUserSpy = jest.spyOn(auth, 'deleteUser').mockResolvedValueOnce(undefined);
        const deleteProfilePicSpy = jest.spyOn(storage, 'deleteProfilePic').mockResolvedValueOnce(undefined);
        const deleteUserReviewsSpy = jest.spyOn(database, 'deleteUserReviews').mockRejectedValueOnce('Error deleting user reviews');

        const response = await request(expressApp)
            .delete('/users')
            .set('Authorization', 'Bearer ValidTokenID');
        
        expect(authSpy).toHaveBeenCalled();
        expect(deleteUserSpy).toHaveBeenCalled();
        expect(deleteProfilePicSpy).toHaveBeenCalled();
        expect(deleteUserReviewsSpy).toHaveBeenCalled();
        expect(response.status).toBe(500);
    });

    test('Should return code 200 User deleted successfully', async () => {
        const authSpy = jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        const deleteUserSpy = jest.spyOn(auth, 'deleteUser').mockResolvedValueOnce(undefined);
        const deleteProfilePicSpy = jest.spyOn(storage, 'deleteProfilePic').mockResolvedValueOnce(undefined);
        const deleteUserReviewsSpy = jest.spyOn(database, 'deleteUserReviews').mockResolvedValueOnce(undefined);

        const response = await request(expressApp)
            .delete('/users')
            .set('Authorization', 'Bearer ValidTokenID');
        
        expect(authSpy).toHaveBeenCalled();
        expect(deleteUserSpy).toHaveBeenCalled();
        expect(deleteProfilePicSpy).toHaveBeenCalled();
        expect(deleteUserReviewsSpy).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'User deleted successfuly' });
    });
});
