export interface Review {
    uid: string
    username: string
    photoURL: string
    score: number
    text: string
}

export interface MovieReviews {
    [reviewId: string]: Review;
}