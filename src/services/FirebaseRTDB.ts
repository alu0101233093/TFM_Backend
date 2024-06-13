import { Database } from "firebase-admin/lib/database/database";
import * as admin from 'firebase-admin';
import { firebaseAdminApp } from ".."
import { AllReviews, MovieReviews, Review } from "../entities/review"

export class FirebaseRTDB {

    private database: Database

    constructor() {
        this.database = firebaseAdminApp.database()
    }

    public async setReview(review: Review, movie_id: string, critic: boolean): Promise<string> {
        const reference = this.database.ref(critic ? 'criticReviews/' + movie_id : 'reviews/' + movie_id);

        return reference.push(review)
            .then((snapshot) => {
                const key = snapshot.key;
                if (key) {
                    return key;
                } else {
                    throw new Error('Failed to get key for the new review.');
                }
            })
            .catch((error) => {
                throw new Error('Error adding review: ' + error.message);
            });
    }

    public async getReviews(movie_id: string): Promise<AllReviews> {
        const spectatorsReference = this.database.ref('reviews/' + movie_id);
        const criticsReference = this.database.ref('criticReviews/' + movie_id);
        let result: AllReviews = {spectators: {}, critics: {}}

        return spectatorsReference.get().then((spectatorsSnapshot) => {
            if (spectatorsSnapshot.exists()) {
                const spectatorsReviews: Record<string, Review> = spectatorsSnapshot.val();
                result.spectators = spectatorsReviews
                return criticsReference.get().then((criticsSnapshot) => {
                    if(criticsSnapshot){
                        const criticsReviews: Record<string, Review> = criticsSnapshot.val();
                        result.critics = criticsReviews
                    }
                    return result 
                }).catch((error) => {
                    throw new Error('Error getting reviews: ' + error.message);
                });
            } else {
                return result;
            }
        }).catch((error) => {
            throw new Error('Error getting reviews: ' + error.message);
        });
    }

    public removeReview(movie_id: string, review_id: string, critic: boolean): Promise<void> {
        const reviewURL = critic ? 'criticReviews' : 'reviews'
        const reference = this.database.ref(reviewURL + '/' + movie_id + '/' + review_id);
        return reference.remove()
    }

    public async deleteUserReviews(uid: string): Promise<void> {
        return this.deleteReviews('criticReviews', uid).then(() => {
            return this.deleteReviews('reviews', uid)
        })
    }
    
    private async deleteReviews(reviewsURL: string, uid: string): Promise<void> {
        try {
            const reviewsRef = this.database.ref(reviewsURL);
            const snapshot = await reviewsRef.once('value');
            if (!snapshot.exists()) {
                return Promise.resolve();
            }
    
            const updates: { [key: string]: null } = {};
            snapshot.forEach((movieSnapshot: admin.database.DataSnapshot) => {
                const movieReviews: MovieReviews = movieSnapshot.val();
                for (const reviewId in movieReviews) {
                    const review = movieReviews[reviewId];
                    if (review.uid === uid) {
                        updates[`/${reviewsURL}/${movieSnapshot.key}/${reviewId}`] = null;
                    }
                }
            });
    
            await this.database.ref().update(updates);
        } catch (error) {
            console.error('Error deleting reviews:', error);
            return Promise.reject(error);
        }
    }    
}