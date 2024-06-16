import { RequestHandler } from "express"
import { AllReviews } from "../models/review/allReviews"
import { Review } from "../models/review/review"
import { FirebaseRTDB } from "../services/FirebaseRTDB"
import { FirebaseAuth } from "../services/FirebaseAuth"

const database = new FirebaseRTDB
const auth = new FirebaseAuth

export const postReview: RequestHandler = (req, res) => {
    if (!req.query.movie_id)
        res.status(400).send({ message: 'Bad request. Movie identifier needed' })

    const idToken = req.headers.authorization?.split(' ')[1]

    if (idToken) {
        auth.verifyIdToken(idToken)
            .then((decodedIdToken) => {
                const MOVIE_ID: string = req.query.movie_id as string
                const REVIEW: Review = {
                    ...req.body,
                    score: parseFloat(req.body.score),
                    uid: decodedIdToken.uid,
                    photoURL: decodedIdToken.picture
                }
                
                database.setReview(REVIEW, MOVIE_ID, decodedIdToken.email_verified == true)
                    .then((review_id) => {
                        res.status(201).send({ message: 'Review published successfuly.', reviewId: review_id })
                    }).catch((error) => {
                        res.status(500).send(error)
                    })
            }).catch((error) => {
                res.status(401).send(error)
            })
    } else {
        res.status(400).send({ message: 'IdToken not found on request' })
    }

}

export const getReviews: RequestHandler = (req, res) => {
    if (!req.query.movie_id)
        res.status(400).send({ message: 'Bad request. Movie identifier needed' })

    const MOVIE_ID: string = req.query.movie_id as string
    database.getReviews(MOVIE_ID)
        .then((reviews: AllReviews) => {
            res.status(200).json(reviews)
        }).catch((error) => {
            res.status(500).send(error)
        })
}

export const deleteReview: RequestHandler = (req, res) => {
    if (!req.query.movie_id)
        res.status(400).send({ message: 'Bad request. Movie identifier needed' })

    const MOVIE_ID: string = req.query.movie_id as string
    const REVIEW_ID: string = req.query.review_id as string

    const idToken = req.headers.authorization?.split(' ')[1]

    if (idToken) {
        auth.verifyIdToken(idToken)
        .then((decodedIdToken) => {
            database.removeReview(MOVIE_ID, REVIEW_ID, decodedIdToken.email_verified == true)
            .then((_) => {
                res.status(200).send({ message: 'Review with ID ' + REVIEW_ID + ' removed successfuly' })
            }).catch((error) => {
                res.status(500).send(error)
            })
        }).catch((error) => {
            res.status(401).send(error)
        })
    } else {
        res.status(400).send({ message: 'IdToken not found on request' })
    }
}