// import { Database, DatabaseReference, getDatabase, ref } from "firebase/database";
// import { firebaseApp } from "..";

export class FirebaseRTDB {
    // private database: Database
    // private reference: DatabaseReference

    constructor(){
        // this.database = getDatabase(firebaseApp)
        // this.reference = ref(this.database)
        //this.reviews_ref = ref(this.database, 'reviews')
    }


    // public setUser(user: singUpUser, user_id: string, profile_pic_url: string) {
    //     this.reference = ref(this.database, 'users/' + user_id)
    //     const user_db: user_firebase_rtdb_value = {
    //         ...user,
    //         profile_pic: profile_pic_url
    //     }
    //     return set(this.reference, user_db)
    // }

    // public async getEmailByUsername(username: string): Promise<string> {
    //     try {
    //         const resultPath = query(ref(this.database, 'users'), orderByChild('username'), equalTo(username), limitToFirst(1));
    //         const result = await get(resultPath);
    
    //         if (result.exists()) {
    //             const userData: user_firebase_rtdb = result.val();
    //             const userEmail = Object.values(userData)[0].email;
    //             return userEmail as string;
    //         } else {
    //             throw new Error;
    //         }
    //     } catch (error) {
    //         throw new Error('Username not found');
    //     }
    // }
    
}