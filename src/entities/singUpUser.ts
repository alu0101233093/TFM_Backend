export interface singUpUser {
    username: string
    password: string
    email: string
    profile_pic: File
    verified: boolean
}

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
};