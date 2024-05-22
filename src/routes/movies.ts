import express from 'express'
import axios from 'axios'
import { MOVIE_API_HEADERS, MOVIE_URL, DEFAULT_MOVIE_REQUEST, BASE_URL, LANGUAGE_QUERY } from '../consts'
import { Review } from '../entities/review'
import { FirebaseRTDB } from '../classes/FirebaseRTDB'

const movie_router = express.Router()
const database = new FirebaseRTDB

movie_router.get('/search', async (req, res) => {
    const request = {
        ...DEFAULT_MOVIE_REQUEST,
        query: req.query.q,
        page: req.query.page ? req.query.page : 1
    }

    try {
        const response = await axios.get(MOVIE_URL, {
            params: request,
            headers: MOVIE_API_HEADERS
        })
        console.log(response)
        res.send(response.data)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send('Internal server error')
    }
})

movie_router.get('/', async (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')

    const MOVIE_ID: string = req.query.movie_id as string
    const URL = BASE_URL + '/3/movie/' + MOVIE_ID + LANGUAGE_QUERY

    try {
        const response = await axios.get(URL, {
            headers: MOVIE_API_HEADERS
        })
        console.log(response)
        res.send(response.data)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send('Internal server error')
    }
})

movie_router.get('/credits', async (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')

    const MOVIE_ID: string = req.query.movie_id as string
    const URL = BASE_URL + '/3/movie/' + MOVIE_ID + '/credits'

    try {
        const response = await axios.get(URL, {
            headers: MOVIE_API_HEADERS
        })
        console.log(response)
        res.send(response.data)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send('Internal server error')
    }
})

movie_router.post('/reviews', express.urlencoded(), (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')
    
    const MOVIE_ID: string = req.query.movie_id as string
    const REVIEW: Review = {...req.body}
    console.log(REVIEW)

    database.setReview(REVIEW, MOVIE_ID)
    .then((review_id) => {
        res.status(201).send('Review published with id:' + review_id)
    }).catch((error) => {
        res.status(500).send(error.message)
    })
})

movie_router.get('/reviews', (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')

    const MOVIE_ID: string = req.query.movie_id as string
    database.getReviews(MOVIE_ID)
    .then((reviews: Record<string, Review>) => {
        res.status(200).json(reviews)
    }).catch((error) => {
        res.status(500).send(error.message)
    })
})

movie_router.delete('/reviews', (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')

    const MOVIE_ID: string = req.query.movie_id as string
    const REVIEW_ID: string = req.query.review_id as string
    database.removeReview(MOVIE_ID, REVIEW_ID)
    .then((_) => {
        res.status(200).send('Review with ID ' + REVIEW_ID + ' removed successfuly')
    }).catch((error) => {
        res.status(500).send(error.message)
    })
})

export default movie_router