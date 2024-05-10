import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "..";
import { isValidEmail } from "../entities/singUpUser";

export class FirebaseAuth {

    private authentication: Auth

    constructor(){
        this.authentication = getAuth(firebaseApp)
    }

    public createUser(email: string, password: string){
        if(!isValidEmail(email))
            return Error('Bad Request. Wrong email format')
    
        return createUserWithEmailAndPassword(this.authentication, email, password)
    }

    public logIn(email: string, password: string){
        return signInWithEmailAndPassword(this.authentication, email, password)
    }

    public logOut(){
        return this.authentication.signOut()
    }
}