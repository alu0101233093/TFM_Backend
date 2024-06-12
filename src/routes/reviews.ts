import express from 'express'
import { deleteReview, getReviews, postReview } from '../controllers/reviewController'

const reviews_router = express.Router()

/**
 * @openapi
 * /reviews:
 *   post:
 *     summary: Post a review for a movie
 *     tags: [Reviews]
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
 *               text:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Review published
 *       400:
 *         description: Bad request. Movie identifier needed
 *       401:
 *         description: Unauthorized. Authentication required.
 *       500:
 *         description: Internal server error
 */
reviews_router.post('/', express.urlencoded({ extended: true }), postReview)

/**
 * @openapi
 * /reviews:
 *   get:
 *     summary: Get reviews for a movie
 *     tags: [Reviews]
 *     parameters:
 *       - name: movie_id
 *         in: query
 *         required: true
 *         description: The ID of the movie
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of reviews
 *       400:
 *         description: Bad request. Movie identifier needed
 *       500:
 *         description: Internal server error
 */
reviews_router.get('/', getReviews)

/**
 * @openapi
 * /reviews:
 *   delete:
 *     summary: Delete a review for a movie
 *     tags: [Reviews]
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Review removed successfully
 *       400:
 *         description: Bad request. Movie identifier or review ID needed
 *       500:
 *         description: Internal server error
 */
reviews_router.delete('/', deleteReview)

export default reviews_router