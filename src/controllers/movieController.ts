import get from "axios"
import { RequestHandler } from "express"
import { MOVIE_API_HEADERS, MOVIE_URL, DEFAULT_MOVIE_REQUEST, BASE_URL, LANGUAGE_QUERY } from '../consts'

export const searchMovie: RequestHandler = async (req, res) => {
    const request = {
        ...DEFAULT_MOVIE_REQUEST,
        query: req.query.q,
        page: req.query.page ? req.query.page : 1
    }

    try {
        const response = await get(MOVIE_URL, {
            params: request,
            headers: MOVIE_API_HEADERS
        })
        res.send(response.data)
    } catch (error) {
        res.status(500).send('Internal server error')
    }
}

export const getMovie: RequestHandler = async (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')

    const MOVIE_ID: string = req.query.movie_id as string
    const URL = BASE_URL + '/3/movie/' + MOVIE_ID + LANGUAGE_QUERY

    try {
        const response = await get(URL, {
            headers: MOVIE_API_HEADERS
        })
        res.send(response.data)
    } catch (error) {
        res.status(500).send('Internal server error')
    }
}

export const getCredits: RequestHandler = async (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')

    const MOVIE_ID: string = req.query.movie_id as string
    const URL = BASE_URL + '/3/movie/' + MOVIE_ID + '/credits'

    try {
        const response = await get(URL, {
            headers: MOVIE_API_HEADERS
        })
        res.send(response.data)
    } catch (error) {
        res.status(500).send('Internal server error')
    }
}
