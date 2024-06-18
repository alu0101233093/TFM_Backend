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
            return Promise.reject(new CustomError('Error creating user.', error));
        })
    }

    public async verifyIdToken(idToken: string): Promise<DecodedIdToken>{
        return firebaseAdminApp.auth().verifyIdToken(idToken)
        .catch((error) => {
            return Promise.reject(new CustomError('Session expired. LogIn again.', error));
        })
    }

    public async updateUser(uid: string, user: UserFirebaseAuth){
        return firebaseAdminApp.auth().updateUser(uid, user)
        .catch((error) => {
            return Promise.reject(new CustomError('Error updating user.', error));
        })
    }

    public async changeUserRole(uid: string, newRol: boolean) {
        return firebaseAdminApp.auth().updateUser(uid, { emailVerified: newRol })
        .then(() => {
            Promise.resolve(`User rol updated successfully.`);
        })
        .catch((error) => {
            return Promise.reject(new CustomError('Error changing user role.', error));
        });
    }

    public async deleteUser(uid: string){
        return firebaseAdminApp.auth().deleteUser(uid)
        .catch((error) => {
            return Promise.reject(new CustomError('Error deleting user.', error));
        })
    }
}