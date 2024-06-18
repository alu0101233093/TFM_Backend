import { firebaseAdminApp } from "../app";
import { isValidEmail, UserFirebaseAuth } from "../models/user/userFirebaseAuth";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export class FirebaseAuth {
    public async createUser(user: UserFirebaseAuth): Promise<UserRecord> {
        if(!isValidEmail(user.email))
            return Promise.reject(new Error('The provided email has an invalid format'))
    
        return firebaseAdminApp.auth().createUser(user)
        .catch((error) => {
            const e: CustomError = new Error('Error creating user.');
            e.originalError = error;
            return Promise.reject(e);
        })
    }

    public async verifyIdToken(idToken: string): Promise<DecodedIdToken>{
        return firebaseAdminApp.auth().verifyIdToken(idToken)
        .catch((error) => {
            const e: CustomError = new Error('Session expired. LogIn again.');
            e.originalError = error;
            return Promise.reject(e);
        })
    }

    public async updateUser(uid: string, user: UserFirebaseAuth){
        return firebaseAdminApp.auth().updateUser(uid, user)
    }

    public async changeUserRole(uid: string, newRol: boolean) {
        return firebaseAdminApp.auth().updateUser(uid, { emailVerified: newRol })
        .then(() => {
            Promise.resolve(`User rol updated successfully.`);
        })
        .catch((error) => {
            const e: CustomError = new Error('Error changing user role.');
            e.originalError = error;
            return Promise.reject(e);
        });
    }

    public async deleteUser(uid: string){
        return firebaseAdminApp.auth().deleteUser(uid)
        .catch((error) => {
            const e: CustomError = new Error('Error deleting user.');
            e.originalError = error;
            return Promise.reject(e);
        })
    }
}