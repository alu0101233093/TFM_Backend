import { Auth, UserCredential, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "..";
import { isValidEmail } from "../entities/singUpUser";

export class FirebaseAuth {

    private authentication: Auth

    constructor(){
        this.authentication = getAuth(firebaseApp)
    }

    public createUser(email: string, password: string): Promise<UserCredential>{
        if(!isValidEmail(email))
            return Promise.reject(new Error('Invalid email format'))
    
        return createUserWithEmailAndPassword(this.authentication, email, password)
    }

    public logIn(email: string, password: string){
        return signInWithEmailAndPassword(this.authentication, email, password)
    }

    public logOut(){
        return this.authentication.signOut()
    }
}