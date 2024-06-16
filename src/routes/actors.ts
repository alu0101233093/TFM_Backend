import express from 'express'
import { getActor, getCasting, getMoviesByActor } from '../controllers/actorController'

const actor_router = express.Router()

/**
 * @openapi
 * /actors/casting:
 *   get:
 *     summary: Get movie casting
 *     tags: [Actors]
 *     parameters:
 *       - name: movie_id
 *         in: query
 *         required: true
 *         description: The ID of the movie
 *         schema:
 *           type: string
 *       - name: language
 *         in: query
 *         description: Language for the response
 *         schema:
 *           type: string
 *           example: es-ES
 *     responses:
 *       200:
 *         description: Movie credits
 *       400:
 *         description: Bad request. Movie identifier needed
 *       500:
 *         description: Internal server error
 */
actor_router.get('/casting', getCasting)

/**
 * @openapi
 * /actors:
 *   get:
 *     summary: Get actor details
 *     tags: [Actors]
 *     parameters:
 *       - name: actor_id
 *         in: query
 *         required: true
 *         description: The ID of the actor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Actor details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 adult:
 *                   type: boolean
 *                 also_known_as:
 *                   type: array
 *                   items:
 *                     type: string
 *                 biography:
 *                   type: string
 *                 birthday:
 *                   type: string
 *                 deathday:
 *                   type: string
 *                   nullable: true
 *                 gender:
 *                   type: number
 *                 homepage:
 *                   type: string
 *                   nullable: true
 *                 id:
 *                   type: number
 *                 imdb_id:
 *                   type: string
 *                 known_for_department:
 *                   type: string
 *                 name:
 *                   type: string
 *                 place_of_birth:
 *                   type: string
 *                 popularity:
 *                   type: number
 *                 profile_path:
 *                   type: string
 *       400:
 *         description: Bad request. Actor identifier needed
 *       500:
 *         description: Internal server error
 */
actor_router.get('/', getActor)

/**
 * @openapi
 * /actors/movies:
 *   get:
 *     summary: Get movies by actor
 *     tags: [Actors]
 *     parameters:
 *       - name: actor_id
 *         in: query
 *         required: true
 *         description: The ID of the actor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of movies by actor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   poster_path:
 *                     type: string
 *                   id:
 *                     type: number
 *                   title:
 *                     type: string
 *       400:
 *         description: Bad request. Actor identifier needed
 *       500:
 *         description: Internal server error
 */
actor_router.get('/movies', getMoviesByActor)

export default actor_router;