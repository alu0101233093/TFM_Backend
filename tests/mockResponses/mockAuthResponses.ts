import { ADMIN_UID } from "../../src/consts";

export const verifyIdTokenResponse = {
    uid: 'user uid',
    picture: 'user photo',
    email_verified: false
} as any

export const verifyAdminIdTokenResponse = {
    uid: ADMIN_UID,
    picture: 'admin photo',
    email_verified: true
} as any

export const signUpUserRequest = {
    email: 'email',
    emailVerified: false,
    password: 'password',
    displayName: 'displayName',
    photoURL: ''
}

export const signUpUserBadRequest = {
    email: 'email',
    emailVerified: false,
    displayName: 'displayName',
    photoURL: ''
}

export const verificationRequest = {
    text: "This is a verification request text."
};