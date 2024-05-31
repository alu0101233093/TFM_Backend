import { Database } from "firebase-admin/lib/database/database";
import { firebaseAdminApp } from ".."
import { Review } from "../entities/review"

export class FirebaseRTDB {

    private database: Database

    constructor(){
        this.database = firebaseAdminApp.database()
    }

    public async setReview(review: Review, movie_id: string): Promise<string> {
        const reference = this.database.ref('reviews/' + movie_id);
        
        return reference.push(review)
            .then((snapshot) => {
                const key = snapshot.key;
                if (key) {
                    console.log('Review added with key: ' + key);
                    return key;
                } else {
                    throw new Error('Failed to get key for the new review.');
                }
            })
            .catch((error) => {
                throw new Error('Error adding review: ' + error.message);
            });
    }

    public async getReviews(movie_id: string): Promise<Record<string,Review>> {
        const reference = this.database.ref('reviews/' + movie_id);
        
        return reference.get().then((snapshot) => {
            if (snapshot.exists()) {
                const reviews: Record<string,Review> = snapshot.val();
                return reviews;
            } else {
                return {};
            }
        }).catch((error) => {
            throw new Error('Error getting reviews: ' + error.message);
        });
    }

    public removeReview(movie_id: string, review_id: string): Promise<void> {
        const reference = this.database.ref('reviews/' + movie_id + '/' + review_id);
        return reference.remove()
    }
    
}