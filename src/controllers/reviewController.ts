import { RequestHandler } from "express"
import { AllReviews } from "../models/review/allReviews"
import { Review } from "../models/review/review"
import { CustomError } from "../models/customError"
import { auth, database } from "../app"

export const postReview: RequestHandler = (req, res) => {
    if (!req.query.movie_id)
        return res.status(400).send(new CustomError('Bad request. Movie identifier needed'))

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
            database.setReview(REVIEW, MOVIE_ID, decodedIdToken.email_verified ?? false)
            .then((review_id) => {
                return res.status(201).send({message: 'Review published successfuly.', reviewId: review_id})
            }).catch((error) => {
                return res.status(500).send(error)
            })
        }).catch((error) => {
            return res.status(401).send(error)
        })
    } else {
        return res.status(400).send(new CustomError('IdToken not found on request'))
    }
}

export const getReviews: RequestHandler = (req, res) => {
    if (!req.query.movie_id)
        return res.status(400).send(new CustomError('Bad request. Movie identifier needed'))

    const MOVIE_ID: string = req.query.movie_id as string
    database.getReviews(MOVIE_ID)
    .then((reviews: AllReviews) => {
        return res.status(200).json(reviews)
    }).catch((error) => {
        return res.status(500).send(error)
    })
}

export const deleteReview: RequestHandler = (req, res) => {
    if (!req.query.movie_id || !req.query.review_id)
        return res.status(400).send(new CustomError('Bad request. Movie and review identifiers needed'))

    const MOVIE_ID: string = req.query.movie_id as string
    const REVIEW_ID: string = req.query.review_id as string

    const idToken = req.headers.authorization?.split(' ')[1]

    if (idToken) {
        auth.verifyIdToken(idToken)
        .then((decodedIdToken) => {
            database.removeReview(MOVIE_ID, REVIEW_ID, decodedIdToken.email_verified ?? false)
            .then(() => {
                return res.status(200).send({message: 'Review with ID ' + REVIEW_ID + ' removed successfuly'})
            }).catch((error) => {
                return res.status(500).send(error)
            })
        }).catch((error) => {
            return res.status(401).send(error)
        })
    } else {
        return res.status(400).send(new CustomError('IdToken not found on request'))
    }
}