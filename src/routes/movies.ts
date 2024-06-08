import express from 'express'
import { getCarousel, getCredits, getHomeList, getMovie, searchMovie } from '../controllers/movieController'

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
 * /movies/carousel:
 *   get:
 *     summary: Get a list of movies for the carousel
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   backdrop_path:
 *                     type: string
 *                     description: The path to the movie backdrop image
 *                   id:
 *                     type: integer
 *                     description: The movie ID
 *                   title:
 *                     type: string
 *                     description: The title of the movie
 *                   overview:
 *                     type: string
 *                     description: The overview of the movie
 *       500:
 *         description: Internal server error
 */
movie_router.get('/carousel', getCarousel)

/**
 * @openapi
 * /movies/home-list:
 *   get:
 *     summary: Get a list of movies for the home page
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   poster_path:
 *                     type: string
 *                     description: The path to the movie poster image
 *                   id:
 *                     type: integer
 *                     description: The movie ID
 *                   title:
 *                     type: string
 *                     description: The title of the movie
 *       500:
 *         description: Internal server error
 */
movie_router.get('/home-list', getHomeList)

export default movie_router