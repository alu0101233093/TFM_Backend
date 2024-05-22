import { firebaseAdminApp } from "..";
import { isValidEmail } from "../entities/singUpUser";
import { user_firebase_auth } from "../entities/user_firebase_auth";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export class FirebaseAuth {

    constructor(){
    }

    public getUser(uid: string): Promise<UserRecord> {
        return firebaseAdminApp.auth().getUser(uid)
    }

    public createUser(user: user_firebase_auth): Promise<UserRecord> {
        if(!isValidEmail(user.email))
            return Promise.reject(new Error('Invalid email format'))
    
        return firebaseAdminApp.auth().createUser(user)
    }
    
    public verifyJWT(jwt: string): Promise<DecodedIdToken>{
        return firebaseAdminApp.auth().verifyIdToken(jwt)
    }

    public updateUser(uid: string, user: user_firebase_auth){
        return firebaseAdminApp.auth().updateUser(uid, user)
    }
}