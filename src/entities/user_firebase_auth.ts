export interface User_firebase_auth {
    email: string
    emailVerified: boolean
    password: string
    displayName: string
    photoURL: string
}

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}