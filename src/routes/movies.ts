import express from 'express'
import axios from 'axios'
import { MOVIE_API_HEADERS, MOVIE_URL, DEFAULT_MOVIE_REQUEST, BASE_URL, LANGUAGE_QUERY } from '../consts'

const movie_router = express.Router()

movie_router.get('/list', async (req, res) => {
    const request = {
        ...DEFAULT_MOVIE_REQUEST,
        query: req.query.q,
        page: req.query.page ? req.query.page : 1
    };

    try {
        const response = await axios.get(MOVIE_URL, {
            params: request,
            headers: MOVIE_API_HEADERS
        });
        console.log(response)
        res.send(response.data)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send('Error interno del servidor')
    }
});

movie_router.get('/', async (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')

    const MOVIE_ID = req.query.movie_id
    const URL = BASE_URL + '/3/movie/' + MOVIE_ID + LANGUAGE_QUERY

    try {
        const response = await axios.get(URL, {
            headers: MOVIE_API_HEADERS
        });
        console.log(response)
        res.send(response.data)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send('Error interno del servidor')
    }
});

movie_router.get('/credits', async (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')

    const MOVIE_ID = req.query.movie_id
    const URL = BASE_URL + '/3/movie/' + MOVIE_ID + '/credits'

    try {
        const response = await axios.get(URL, {
            headers: MOVIE_API_HEADERS
        });
        console.log(response)
        res.send(response.data)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send('Error interno del servidor')
    }
});

export default movie_router