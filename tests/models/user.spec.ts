import { UserFirebaseAuth, isValidEmail } from "../../src/models/user/userFirebaseAuth";

describe('UserFirebaseAuth Model', () => {
    test('should create a user with correct properties', () => {
        const user: UserFirebaseAuth = {
            email: 'test@example.com',
            emailVerified: true,
            password: 'securepassword',
            displayName: 'John Doe',
            photoURL: 'http://example.com/photo.jpg'
        };

        expect(user).toHaveProperty('email', 'test@example.com');
        expect(user).toHaveProperty('emailVerified', true);
        expect(user).toHaveProperty('password', 'securepassword');
        expect(user).toHaveProperty('displayName', 'John Doe');
        expect(user).toHaveProperty('photoURL', 'http://example.com/photo.jpg');
    });
});

describe('isValidEmail Function', () => {
    test('should return true for a valid email', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
    });

    test('should return false for an email without @ symbol', () => {
        expect(isValidEmail('testexample.com')).toBe(false);
    });

    test('should return false for an email without domain', () => {
        expect(isValidEmail('test@')).toBe(false);
    });

    test('should return false for an email without top-level domain', () => {
        expect(isValidEmail('test@example')).toBe(false);
    });

    test('should return false for an email with spaces', () => {
        expect(isValidEmail(' test@example.com ')).toBe(false);
    });

    test('should return false for an empty string', () => {
        expect(isValidEmail('')).toBe(false);
    });
});
