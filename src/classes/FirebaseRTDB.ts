// import { Database, DatabaseReference, getDatabase, ref } from "firebase/database";
// import { firebaseApp } from "..";
import { firebaseAdminApp } from ".."
import { Review } from "../entities/review"

export class FirebaseRTDB {
    // private database: Database
    // private reference: DatabaseReference

    constructor(){
        // this.database = getDatabase(firebaseApp)
        // this.reference = ref(this.database)
        //this.reviews_ref = ref(this.database, 'reviews')
    }


    public async setReview(review: Review, movie_id: string): Promise<string> {
        const reference = firebaseAdminApp.database().ref(`reviews/${movie_id}`);
        
        return reference.push(review)
            .then((snapshot) => {
                const key = snapshot.key;
                if (key) {
                    console.log(`Review added with key: ${key}`);
                    return key;
                } else {
                    throw new Error('Failed to get key for the new review.');
                }
            })
            .catch((error) => {
                throw new Error(`Error adding review: ${error.message}`);
            });
    }

    public async getReviews(movie_id: string): Promise<Record<string,Review>> {
        const reference = firebaseAdminApp.database().ref('reviews/' + movie_id);
        
        return reference.get().then((snapshot) => {
            if (snapshot.exists()) {
                const reviews: Record<string,Review> = snapshot.val();
                return reviews;
            } else {
                return {};
            }
        }).catch((error) => {
            throw new Error(`Error getting reviews: ${error.message}`);
        });
    }

    public removeReview(movie_id: string, review_id: string): Promise<void> {
        const reference = firebaseAdminApp.database().ref(`reviews/${movie_id}/${review_id}`);
        return reference.remove()
    }

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