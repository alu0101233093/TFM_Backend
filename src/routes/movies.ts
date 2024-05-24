import express from 'express'
import axios from 'axios'
import { MOVIE_API_HEADERS, MOVIE_URL, DEFAULT_MOVIE_REQUEST, BASE_URL, LANGUAGE_QUERY } from '../consts'
import { Review } from '../entities/review'
import { FirebaseRTDB } from '../services/FirebaseRTDB'

const movie_router = express.Router()
const database = new FirebaseRTDB

/**
 * @openapi
 * /movies/search:
 *   get:
 *     summary: Search for movies
 *     tags: [Movies]
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         description: Query string for searching movies
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of movies
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /movies:
 *   get:
 *     summary: Get movie details
 *     tags: [Movies]
 *     parameters:
 *       - name: movie_id
 *         in: query
 *         required: true
 *         description: The ID of the movie
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie details
 *       400:
 *         description: Bad request. Movie identifier needed
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /movies/credits:
 *   get:
 *     summary: Get movie credits
 *     tags: [Movies]
 *     parameters:
 *       - name: movie_id
 *         in: query
 *         required: true
 *         description: The ID of the movie
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie credits
 *       400:
 *         description: Bad request. Movie identifier needed
 *       500:
 *         description: Internal server error
 */
movie_router.get('/credits', async (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')

    const MOVIE_ID: string = req.query.movie_id as string
    const URL = BASE_URL + '/3/movie/' + MOVIE_ID + '/credits'

    try {
        const response = await axios.get(URL, {
            headers: MOVIE_API_HEADERS
        })
        console.log(response.data)
        res.send(response.data)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send('Internal server error')
    }
})

/**
 * @openapi
 * /movies/reviews:
 *   post:
 *     summary: Post a review for a movie
 *     tags: [Movies]
 *     parameters:
 *       - name: movie_id
 *         in: query
 *         required: true
 *         description: The ID of the movie
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               score:
 *                 type: number
 *               review:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review published
 *       400:
 *         description: Bad request. Movie identifier needed
 *       500:
 *         description: Internal server error
 */
movie_router.post('/reviews', express.urlencoded({ extended: true }), (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')
    
    const MOVIE_ID: string = req.query.movie_id as string
    const REVIEW: Review = {...req.body}

    database.setReview(REVIEW, MOVIE_ID)
    .then((review_id) => {
        console.log('Review published with id:' + review_id)
        res.status(201).send('Review published with id:' + review_id)
    }).catch((error) => {
        res.status(500).send(error.message)
    })
})

/**
 * @openapi
 * /movies/reviews:
 *   get:
 *     summary: Get reviews for a movie
 *     tags: [Movies]
 *     parameters:
 *       - name: movie_id
 *         in: query
 *         required: true
 *         description: The ID of the movie
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reviews
 *       400:
 *         description: Bad request. Movie identifier needed
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /movies/reviews:
 *   delete:
 *     summary: Delete a review for a movie
 *     tags: [Movies]
 *     parameters:
 *       - name: movie_id
 *         in: query
 *         required: true
 *         description: The ID of the movie
 *         schema:
 *           type: string
 *       - name: review_id
 *         in: query
 *         required: true
 *         description: The ID of the review
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review removed successfully
 *       400:
 *         description: Bad request. Movie identifier or review ID needed
 *       500:
 *         description: Internal server error
 */
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