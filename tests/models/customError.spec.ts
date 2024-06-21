import { CustomError } from "../../src/models/customError";

describe('CustomError', () => {
    test('should create an instance of CustomError with a message and original error', () => {
        const message = 'An error occurred';
        const originalError = new Error('Original error');

        const error = new CustomError(message, originalError);

        expect(error).toBeInstanceOf(CustomError);
        expect(error.name).toBe(message);
        expect(error.originalError).toBe(originalError);
        expect(error.stack).toBeDefined();
    });

    test('should create an instance of CustomError with only a message', () => {
        const message = 'An error occurred';

        const error = new CustomError(message);

        expect(error).toBeInstanceOf(CustomError);
        expect(error.name).toBe(message);
        expect(error.originalError).toBeUndefined();
        expect(error.stack).toBeDefined();
    });

    test('should capture the stack trace', () => {
        const message = 'An error occurred';
        const originalError = new Error('Original error');

        const error = new CustomError(message, originalError);

        expect(error.stack).toContain(message);
    });
});
