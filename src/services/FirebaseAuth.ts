import { firebaseAdminApp } from "..";
import { isValidEmail } from "../models/user/userFirebaseAuth";
import { UserFirebaseAuth } from "../models/user/userFirebaseAuth";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export class FirebaseAuth {

    constructor(){
    }

    public async createUser(user: UserFirebaseAuth): Promise<UserRecord> {
        if(!isValidEmail(user.email))
            return Promise.reject({message: 'The provided email has an invalid format'})
    
        return firebaseAdminApp.auth().createUser(user)
        .catch((error) => {
            return Promise.reject({message: "Error creating user. ", error})
        })
    }

    public async verifyIdToken(idToken: string): Promise<DecodedIdToken>{
        return firebaseAdminApp.auth().verifyIdToken(idToken)
    }

    public async updateUser(uid: string, user: UserFirebaseAuth){
        return firebaseAdminApp.auth().updateUser(uid, user)
    }

    public async changeUserRol(uid: string, newRol: boolean) {
        return firebaseAdminApp.auth().updateUser(uid, { emailVerified: newRol })
        .then(() => {
            Promise.resolve(`User rol updated successfully.`);
        })
        .catch((error) => {
            Promise.reject(error);
        });
    }

    public async deleteUser(uid: string){
        return firebaseAdminApp.auth().deleteUser(uid)
    }
}