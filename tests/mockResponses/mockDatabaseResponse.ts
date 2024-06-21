import { AllReviews } from "../../src/models/review/allReviews";

export const getReviewsResponse: AllReviews = {
    critics: {
        review1: {
            movieId: 558,
            uid: 'user1',
            username: 'John Doe',
            photoURL: 'https://example.com/photos/user1.jpg',
            score: 8,
            text: 'Great movie! The plot was intriguing and the acting was top-notch.'
        }
    },
    spectators: {
        review2: {
            movieId: 558,
            uid: 'user2',
            username: 'Jane Smith',
            photoURL: 'https://example.com/photos/user2.jpg',
            score: 6,
            text: 'It was a decent movie, but it had some slow parts that made it hard to stay engaged.'
        },
        review3: {
            movieId: 123,
            uid: 'user3',
            username: 'Bob Brown',
            photoURL: 'https://example.com/photos/user3.jpg',
            score: 9,
            text: 'Absolutely loved it! The cinematography was beautiful and the story was very moving.'
        }
    }
}

export const verificationRequests = [
    {
        requestID: '1',
        uid: 'user1',
        status: 'Pending',
        user: {
            email: 'user1@example.com',
            emailVerified: true,
            photoURL: 'user1-photo-url'
        },
        text: 'Verification request text 1'
    },
    {
        requestID: '2',
        uid: 'user2',
        status: 'Approved',
        user: {
            email: 'user2@example.com',
            emailVerified: true,
            photoURL: 'user2-photo-url'
        },
        text: 'Verification request text 2'
    }
];