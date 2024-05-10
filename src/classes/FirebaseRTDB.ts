import { Database, DatabaseReference, equalTo, get, getDatabase, limitToFirst, orderByChild, query, ref, push } from "firebase/database";
import { firebaseApp } from "..";
import { user_firebase_rtdb } from "../entities/user_firebase_rtdb";

export class FirebaseRTDB {
    private database: Database
    private user_ref: DatabaseReference
    // private reviews_ref: DatabaseReference

    constructor(){
        this.database = getDatabase(firebaseApp)
        this.user_ref = ref(this.database, 'users')
        //this.reviews_ref = ref(this.database, 'reviews')
    }

    public setUser(user: user_firebase_rtdb) {
        return push(this.user_ref, user)
    }

    public async getEmailByUsername(username: string) {
        const resultPath = query(ref(this.database, 'users'), orderByChild('username'), equalTo(username), limitToFirst(1))
        const result = await get(resultPath)
        if (result.exists()) {
            const userData: user_firebase_rtdb = result.val()
            return Object.values(userData)[0].email
        } else {
            return ''
        }
    }
}