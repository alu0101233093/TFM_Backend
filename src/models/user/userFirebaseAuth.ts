export interface UserFirebaseAuth {
    email: string
    password: string
    emailVerified: boolean
    displayName: string
    photoURL: string
}

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}