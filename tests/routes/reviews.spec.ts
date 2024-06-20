import request from 'supertest';
import expressApp, { auth, database } from '../../src/app';
import { verifyIdTokenResponse } from '../mockResponses/mockAuthResponses'
import { getReviewsResponse } from '../mockResponses/mockDatabaseResponse'

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
            setReview: jest.fn(),
            getReviews: jest.fn(),
            removeReview: jest.fn()
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

    test('Should return code 400 without movie_id', async () => {
        const response = await request(expressApp)
            .post('/reviews')
            .set('Authorization', 'Valid TokenID')
        
        expect(response.status).toBe(400);
    });

    test('Should return code 400 without Authorization header', async () => {
        const response = await request(expressApp)
            .post('/reviews')
            .query({ movie_id: 558 });

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

    test('Should return code 500 database upload failed', async () => {
        jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        jest.spyOn(database,'setReview').mockRejectedValueOnce('Database upload failed');

        const response = await request(expressApp)
            .post('/reviews')
            .set('Authorization', 'Valid TokenID')
            .query({ movie_id: 558 });

        expect(response.status).toBe(500);
    });

    test('Should return code 201', async () => {
        jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        jest.spyOn(database,'setReview').mockResolvedValueOnce('review ID');

        const response = await request(expressApp)
            .post('/reviews')
            .set('Authorization', 'Valid TokenID')
            .query({ movie_id: 558 });

        expect(response.status).toBe(201);
    });
});

describe('GET /reviews', () => {

    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterAll(() => {
        jest.restoreAllMocks()
    })

    test('Should return code 400 without movie_id', async () => {
        const response = await request(expressApp)
            .get('/reviews')
        
        expect(response.status).toBe(400);
    });

    test('Should return code 500 error fetching database', async () => {
        jest.spyOn(database,'getReviews').mockRejectedValueOnce('Error fetching database');
        const response = await request(expressApp)
            .get('/reviews')
            .query({movie_id: 558})
        
        expect(response.status).toBe(500);
    });

    test('Should return code 200', async () => {
        jest.spyOn(database,'getReviews').mockResolvedValueOnce(getReviewsResponse);
        const response = await request(expressApp)
            .get('/reviews')
            .query({movie_id: 558})
        
        expect(response.status).toBe(200);
    });
});

describe('DELETE /reviews', () => {

    beforeEach(() => {
        jest.resetAllMocks()
    })

    afterAll(() => {
        jest.restoreAllMocks()
    })

    test('Should return code 400 without any param', async () => {
        const response = await request(expressApp)
            .delete('/reviews')
        
        expect(response.status).toBe(400);
    });

    test('Should return code 400 without Authorization header', async () => {
        const response = await request(expressApp)
            .delete('/reviews')
            .query({ movie_id: 558 })
            .query({ review_id: 1})

        expect(response.status).toBe(400);
    });

    test('Should return code 401 Unauthorized', async () => {
        jest.spyOn(auth,'verifyIdToken').mockRejectedValueOnce('Invalid TokenID')
        
        const response = await request(expressApp)
            .delete('/reviews')
            .set('Authorization', 'Invalid TokenID')
            .query({ movie_id: 558 })
            .query({ review_id: 1})
            
        expect(response.status).toBe(401);
    });

    test('Should return code 500 database deletion failed', async () => {
        jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        jest.spyOn(database,'removeReview').mockRejectedValueOnce('Database deletion failed');

        const response = await request(expressApp)
            .delete('/reviews')
            .set('Authorization', 'Valid TokenID')
            .query({ movie_id: 558 })
            .query({ review_id: 1})

        expect(response.status).toBe(500);
    });

    test('Should return code 200', async () => {
        jest.spyOn(auth,'verifyIdToken').mockResolvedValueOnce(verifyIdTokenResponse);
        jest.spyOn(database, 'removeReview').mockResolvedValueOnce();

        const response = await request(expressApp)
            .delete('/reviews')
            .set('Authorization', 'Valid TokenID')
            .query({ movie_id: 558 })
            .query({ review_id: 1})

        expect(response.status).toBe(200);
    });
});