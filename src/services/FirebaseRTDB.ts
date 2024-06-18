import { Database } from "firebase-admin/lib/database/database";
import * as admin from 'firebase-admin';
import { firebaseAdminApp } from "../app";
import { Review } from "../models/review/review"
import { AllReviews } from "../models/review/allReviews";
import { VerificationRequest } from "../models/verificationRequest";

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
                return Promise.reject('Failed to get key for the new review.');
            }
        })
        .catch((error) => {
            return Promise.reject(new CustomError('Error saving the new review.', error));
        });
    }

    public async getReviews(movie_id: string): Promise<AllReviews> {
        const spectatorsReference = this.database.ref('reviews/' + movie_id);
        const criticsReference = this.database.ref('criticReviews/' + movie_id);
        let result: AllReviews = {spectators: {}, critics: {}}

        return spectatorsReference.get().then(async (spectatorsSnapshot) => {
            if (spectatorsSnapshot.exists()) {
                const spectatorsReviews: Record<string, Review> = spectatorsSnapshot.val();
                result.spectators = spectatorsReviews
            }
            return criticsReference.get().then((criticsSnapshot) => {
                if(criticsSnapshot.exists()){
                    const criticsReviews: Record<string, Review> = criticsSnapshot.val();
                    result.critics = criticsReviews
                }
                return Promise.resolve(result)
            }).catch((error) => {
                return Promise.reject(new CustomError('Error getting critic reviews.', error));
            });
        }).catch((error) => {
            return Promise.reject(new CustomError('Error getting spectator reviews.', error));
        });
    }

    public async removeReview(movie_id: string, review_id: string, critic: boolean): Promise<void> {
        const reviewURL = critic ? 'criticReviews' : 'reviews'
        const reference = this.database.ref(reviewURL + '/' + movie_id + '/' + review_id);
        return reference.remove().catch((error) => {
            return Promise.reject(new CustomError('Error deleting review.', error));
        })
    }

    public async deleteUserReviews(uid: string): Promise<void> {
        this.deleteReviews('criticReviews', uid)
        .catch((error) => {
            return Promise.reject(error);
        })

        this.deleteReviews('reviews', uid)
        .then(() => {return Promise.resolve()})
        .catch((error) => {
            return Promise.reject(error);
        })
    }
    
    private async deleteReviews(reviewsURL: string, uid: string): Promise<void> {
        const reviewsRef = this.database.ref(reviewsURL);
    
        return reviewsRef.once('value').then(async (snapshot) => {
            if (!snapshot.exists()) {
                return Promise.resolve()
            }
    
            const updates: { [key: string]: null } = {};
            snapshot.forEach((movieSnapshot: admin.database.DataSnapshot) => {
                const movieReviews: Record<string, Review> = movieSnapshot.val();
                for (const reviewId in movieReviews) {
                    const review = movieReviews[reviewId];
                    if (review.uid === uid) {
                        updates[`/${reviewsURL}/${movieSnapshot.key}/${reviewId}`] = null;
                    }
                }
            });
    
            return this.database.ref().update(updates).catch((error) => {
                return Promise.reject(new CustomError('Error deleting user review.', error));
            })
        }).catch((error) => {
            return Promise.reject(new CustomError('Error finding user reviews.', error));
        });
    }

    public async getVerificationRequests(): Promise<VerificationRequest[]> {
        const requestsReference = this.database.ref('verificationRequests');

        return requestsReference.get().then((criticsSnapshot) => {
            if(criticsSnapshot.exists()){
                const requestsObject = criticsSnapshot.val();
                const requests: VerificationRequest[] = Object.keys(requestsObject).map(key => {
                    return {
                        requestID: key,
                        ...requestsObject[key]
                    } as VerificationRequest;
                });
                return requests;
            } else {
                return Promise.reject('No requests found.');
            }
        }).catch((error) => {
            return Promise.reject(new CustomError('Error getting verification requests.', error));
        });
    }

    public async setVerificationRequest(request: VerificationRequest): Promise<string> {
        const reference = this.database.ref('verificationRequests');

        return reference.push(request)
        .then((snapshot) => {
            const key = snapshot.key;
            if (key) {
                return key;
            } else {
                return Promise.reject(new CustomError('Failed to get key for the new request.'));
            }
        })
        .catch((error) => {
            return Promise.reject(new CustomError('Error saving verification request.', error));
        });
    }

    public async updateRequestStatus(requestID: string, newStatus: string): Promise<string> {
        const reference = this.database.ref(`verificationRequests/${requestID}`);

        return reference.once('value')
            .then(async (snapshot) => {
                const request = snapshot.val();
                if (!request) {
                    return Promise.reject(new CustomError(`Request ${requestID} not found.`));
                }

                const uid = request.uid;

                if (newStatus != 'Pending') {
                    const sourcePath = newStatus === 'Approved' ? '/reviews' : '/criticReviews';
                    const destinationPath = newStatus === 'Approved' ? '/criticReviews' : '/reviews';

                    return this.moveReviews(uid, sourcePath, destinationPath)
                    .then(async () => {
                        return reference.update({ status: newStatus })
                            .then(() => {return Promise.resolve(request.uid)});
                    })
                    .catch((error) => {
                        return Promise.reject(error);
                    });
                } else {
                    return Promise.resolve(request.uid);
                }
            })
            .catch((error) => {
                return Promise.reject(new CustomError('Error updating request.', error));
            });
    }

    private async moveReviews(uid: string, sourcePath: string, destinationPath: string): Promise<void> {
        const sourceRef = this.database.ref(sourcePath);
        const destinationRef = this.database.ref(destinationPath)

        return sourceRef.once('value')
        .then(async (snapshot) => {
            const reviews = snapshot.val();
            if (!reviews) {
                return Promise.resolve();
            }

            const updates: { [key: string]: any } = {};
            const deletions: { [key: string]: null } = {};

            Object.keys(reviews).forEach((movieId) => {
                const movieReviews = reviews[movieId];
                Object.keys(movieReviews).forEach((reviewId) => {
                    const review = movieReviews[reviewId] as Review;
                    if (review.uid === uid) {
                        updates[`${movieId}/${reviewId}`] = review;
                        deletions[`${movieId}/${reviewId}`] = null;
                    }
                });
            });

            if(!updates){
                return Promise.resolve()
            } else {
                return destinationRef.update(updates).then(() => sourceRef.update(deletions));
            }
        })
        .catch((error) => {
            return Promise.reject(new CustomError(
                `Error moving reviews from ${sourcePath} to ${destinationPath}: ${error.message}`, 
                error
            ));
        });
    }
    
}