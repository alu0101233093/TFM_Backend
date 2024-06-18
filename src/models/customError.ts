export class CustomError extends Error {
    originalError?: any;

    constructor(message: string, originalError?: any) {
        super(message);
        this.name = 'CustomError';
        this.originalError = originalError;
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
    }
}