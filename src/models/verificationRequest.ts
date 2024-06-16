export interface VerificationRequest {
    requestID?: string
    uid: string
    status: string
    user: {
        email: string
        emailVerified: boolean
        photoURL: string
    }
    text: string
}