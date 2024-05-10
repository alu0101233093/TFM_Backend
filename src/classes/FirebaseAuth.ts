import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "..";
import { isValidEmail, singUpUser } from "../entities/singUpUser";

export class FirebaseAuth {

    private authentication: Auth

    constructor(){
        this.authentication = getAuth(firebaseApp)
    }

    public createUser(user: singUpUser){
        if(!isValidEmail(user.email))
            return Error('Bad Request. Wrong email format')
    
        return createUserWithEmailAndPassword(this.authentication, user.email, user.password)
    }

    public logIn(email: string, password: string){
        return signInWithEmailAndPassword(this.authentication, email, password)
    }

    public logOut(){
        return this.authentication.signOut()
    }
}