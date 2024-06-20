import { VerificationRequest } from "../../src/models/verificationRequest";

describe('VerificationRequest Model', () => {
    test('should create a verification request with all properties', () => {
        const request: VerificationRequest = {
            requestID: '123',
            uid: 'user-uid',
            status: 'pending',
            user: {
                email: 'test@example.com',
                emailVerified: true,
                photoURL: 'http://example.com/photo.jpg'
            },
            text: 'Verification text'
        };

        expect(request).toHaveProperty('requestID', '123');
        expect(request).toHaveProperty('uid', 'user-uid');
        expect(request).toHaveProperty('status', 'pending');
        expect(request).toHaveProperty('user');
        expect(request.user).toHaveProperty('email', 'test@example.com');
        expect(request.user).toHaveProperty('emailVerified', true);
        expect(request.user).toHaveProperty('photoURL', 'http://example.com/photo.jpg');
        expect(request).toHaveProperty('text', 'Verification text');
    });

    test('should create a verification request without optional properties', () => {
        const request: VerificationRequest = {
            uid: 'user-uid',
            status: 'pending',
            user: {
                email: 'test@example.com',
                emailVerified: true,
                photoURL: 'http://example.com/photo.jpg'
            },
            text: 'Verification text'
        };

        expect(request).not.toHaveProperty('requestID');
        expect(request).toHaveProperty('uid', 'user-uid');
        expect(request).toHaveProperty('status', 'pending');
        expect(request).toHaveProperty('user');
        expect(request.user).toHaveProperty('email', 'test@example.com');
        expect(request.user).toHaveProperty('emailVerified', true);
        expect(request.user).toHaveProperty('photoURL', 'http://example.com/photo.jpg');
        expect(request).toHaveProperty('text', 'Verification text');
    });
});