import { firebaseAdminApp } from "../app";
import { isValidEmail, UserFirebaseAuth } from "../models/user/userFirebaseAuth";
import { auth } from "firebase-admin";
import { CustomError } from "../models/customError";

export class FirebaseAuth {
    public async createUser(user: UserFirebaseAuth): Promise<auth.UserRecord> {
        if (!isValidEmail(user.email))
            return Promise.reject(new CustomError('The provided email has an invalid format'));

        return firebaseAdminApp.auth().createUser(user)
            .catch((error) => {
                return Promise.reject(new CustomError('Error creating user.', error));
            });
    }

    public async verifyIdToken(idToken: string): Promise<auth.DecodedIdToken> {
        return firebaseAdminApp.auth().verifyIdToken(idToken)
            .catch((error) => {
                return Promise.reject(new CustomError('Session expired. LogIn again.', error));
            });
    }

    public async updateUser(uid: string, user: UserFirebaseAuth) {
        return firebaseAdminApp.auth().updateUser(uid, user)
            .catch((error) => {
                return Promise.reject(new CustomError('Error updating user.', error));
            });
    }

    public async changeUserRole(uid: string, newRol: boolean) {
        return firebaseAdminApp.auth().updateUser(uid, { emailVerified: newRol })
            .then(() => {
                return Promise.resolve(`User role updated successfully.`);
            })
            .catch((error) => {
                return Promise.reject(new CustomError('Error changing user role.', error));
            });
    }

    public async deleteUser(uid: string) {
        return firebaseAdminApp.auth().deleteUser(uid)
            .catch((error) => {
                return Promise.reject(new CustomError('Error deleting user.', error));
            });
    }
}
