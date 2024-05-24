import express from 'express'
import { getCredits, getMovie, searchMovie } from '../controllers/movieController'
import { deleteReview, getReviews, postReview } from '../controllers/reviewController'

const movie_router = express.Router()

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
movie_router.get('/search', searchMovie)

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
movie_router.get('/', getMovie)

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
movie_router.get('/credits', getCredits)

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
movie_router.post('/reviews', express.urlencoded({ extended: true }), postReview)

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
movie_router.get('/reviews', getReviews)

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
movie_router.delete('/reviews', deleteReview)

export default movie_router