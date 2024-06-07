export interface Review {
    uid: string
    username: string
    photoURL: string
    score: number
    review: string
}

export interface MovieReviews {
    [reviewId: string]: Review;
}