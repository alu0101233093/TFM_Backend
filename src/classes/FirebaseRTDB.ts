import { Database, DatabaseReference, equalTo, get, getDatabase, limitToFirst, orderByChild, query, ref, set } from "firebase/database";
import { firebaseApp } from "..";
import { user_firebase_rtdb, user_firebase_rtdb_value } from "../entities/user_firebase_rtdb";
import { singUpUser } from "../entities/singUpUser";

export class FirebaseRTDB {
    private database: Database
    private reference: DatabaseReference

    constructor(){
        this.database = getDatabase(firebaseApp)
        this.reference = ref(this.database)
        //this.reviews_ref = ref(this.database, 'reviews')
    }

    public setUser(user: singUpUser, user_id: string) {
        this.reference = ref(this.database, 'users/' + user_id)
        const user_db: user_firebase_rtdb_value = {
            ...user,
            profile_pic: '/users/' + user_id
        }
        return set(this.reference, user_db)
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