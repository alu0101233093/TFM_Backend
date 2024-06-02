import { RequestHandler } from "express"
import { Review } from "../entities/review"
import { FirebaseRTDB } from "../services/FirebaseRTDB"

const database = new FirebaseRTDB

export const postReview: RequestHandler = (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')
    
    const MOVIE_ID: string = req.query.movie_id as string
    const REVIEW: Review = {...req.body}

    database.setReview(REVIEW, MOVIE_ID)
    .then((review_id) => {
        res.status(201).send('Review published with id:' + review_id)
    }).catch((error) => {
        res.status(500).send(error)
    })
}

export const getReviews: RequestHandler = (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')

    const MOVIE_ID: string = req.query.movie_id as string
    database.getReviews(MOVIE_ID)
    .then((reviews: Record<string, Review>) => {
        res.status(200).json(reviews)
    }).catch((error) => {
        res.status(500).send(error)
    })
}

export const deleteReview: RequestHandler = (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')

    const MOVIE_ID: string = req.query.movie_id as string
    const REVIEW_ID: string = req.query.review_id as string
    database.removeReview(MOVIE_ID, REVIEW_ID)
    .then((_) => {
        res.status(200).send('Review with ID ' + REVIEW_ID + ' removed successfuly')
    }).catch((error) => {
        res.status(500).send(error)
    })
}