import { firebaseAdminApp } from "..";
import { isValidEmail } from "../models/user/userFirebaseAuth";
import { UserFirebaseAuth } from "../models/user/userFirebaseAuth";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export class FirebaseAuth {

    constructor(){
    }

    public createUser(user: UserFirebaseAuth): Promise<UserRecord> {
        if(!isValidEmail(user.email))
            return Promise.reject({
                code: 'backend/invalid-email',
                message: 'The provided email has an invalid format'
            })
    
        return firebaseAdminApp.auth().createUser(user)
    }
    
    public verifyIdToken(idToken: string): Promise<DecodedIdToken>{
        return firebaseAdminApp.auth().verifyIdToken(idToken)
    }

    public updateUser(uid: string, user: UserFirebaseAuth){
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

    public deleteUser(uid: string){
        return firebaseAdminApp.auth().deleteUser(uid)
    }
}