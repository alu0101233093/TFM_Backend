export class CustomError extends Error {
    originalError?: any;

    constructor(message: string, originalError?: any) {
        super()
        this.name = message;
        this.originalError = originalError;
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
    }
}