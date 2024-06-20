import { AllReviews } from "../../src/models/review/allReviews";
import { Review } from "../../src/models/review/review";

describe('Review Model', () => {
    test('should create a review with correct properties', () => {
        const review: Review = {
            movieId: 123,
            uid: 'user123',
            username: 'John Doe',
            photoURL: 'http://example.com/photo.jpg',
            score: 5,
            text: 'Great movie!'
        };

        expect(review).toHaveProperty('movieId', 123);
        expect(review).toHaveProperty('uid', 'user123');
        expect(review).toHaveProperty('username', 'John Doe');
        expect(review).toHaveProperty('photoURL', 'http://example.com/photo.jpg');
        expect(review).toHaveProperty('score', 5);
        expect(review).toHaveProperty('text', 'Great movie!');
    });
});

describe('AllReviews Model', () => {
    test('should create an all reviews object with correct properties', () => {
        const review1: Review = {
            movieId: 123,
            uid: 'user123',
            username: 'John Doe',
            photoURL: 'http://example.com/photo.jpg',
            score: 5,
            text: 'Great movie!'
        };

        const review2: Review = {
            movieId: 456,
            uid: 'user456',
            username: 'Jane Smith',
            photoURL: 'http://example.com/photo2.jpg',
            score: 4,
            text: 'Good movie!'
        };

        const allReviews: AllReviews = {
            spectators: {
                'user123': review1,
                'user456': review2
            },
            critics: {
                'critic123': review1,
                'critic456': review2
            }
        };

        expect(allReviews.spectators).toHaveProperty('user123', review1);
        expect(allReviews.spectators).toHaveProperty('user456', review2);
        expect(allReviews.critics).toHaveProperty('critic123', review1);
        expect(allReviews.critics).toHaveProperty('critic456', review2);
    });
});
