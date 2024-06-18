import get from "axios"
import { RequestHandler } from "express"
import { MOVIE_API_HEADERS, MOVIE_URL, DEFAULT_MOVIE_REQUEST, BASE_URL, BACKDROP_URL_PREFIX, POSTER_URL_PREFIX } from '../consts'
import { CarouselMovie } from "../models/movie/carouselMovie"
import { MoviePoster } from "../models/movie/moviePoster"

export const searchMovie: RequestHandler = (req, res) => {
    const request = {
        ...DEFAULT_MOVIE_REQUEST,
        query: req.query.q,
        page: req.query.page ? req.query.page : 1
    }

    get(MOVIE_URL, {
        params: request,
        headers: MOVIE_API_HEADERS
    }).then((response) => {
        const MOVIES: MoviePoster[] = response.data.results.map((movie: any) => ({
            poster_path: (
                movie.poster_path ?
                POSTER_URL_PREFIX + movie.poster_path :
                movie.poster_path
            ),
            id: movie.id,
            title: movie.title,
        }))
        res.json(MOVIES)
    }).catch((error) => {
        res.status(500).send({message: 'Error getting query from API server', error})
    })
}

export const getMovie: RequestHandler = (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send({message: 'Bad request. Movie identifier needed'})

    const MOVIE_ID: string = req.query.movie_id as string
    const URL = BASE_URL + '/3/movie/' + MOVIE_ID

    get(URL, {
        headers: MOVIE_API_HEADERS
    }).then((response) => {
        res.send(response.data)
    }).catch((error) => {
        res.status(500).send({message: 'Error getting movie from API server', error})
    }) 
}

export const getCarousel: RequestHandler = (_req, res) => {
    const URL = BASE_URL + '/3/discover/movie'

    get(URL, {
        headers: MOVIE_API_HEADERS
    }).then((response) => {
        const MOVIES: CarouselMovie[] = response.data.results.map((movie: any) => ({
            backdrop_path: (
                movie.backdrop_path ? 
                BACKDROP_URL_PREFIX + movie.backdrop_path : 
                movie.backdrop_path
            ),
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
        }))
        res.json(MOVIES)
    }).catch((error) => {
        res.status(500).send({message: 'Error getting movies from API server', error})
    })
}

export const getHomeList: RequestHandler = (_req, res) => {
    const URL = BASE_URL + '/3/discover/movie'

    get(URL, {
        headers: MOVIE_API_HEADERS
    }).then((response) => {
        const MOVIES: MoviePoster[] = response.data.results.map((movie: any) => ({
            poster_path: (
                movie.poster_path ?
                POSTER_URL_PREFIX + movie.poster_path :
                movie.poster_path
            ),
            id: movie.id,
            title: movie.title,
        }))
        res.json(MOVIES)
    }).catch((error) => {
        const e: CustomError = new Error('Error getting movie list from API server');
        e.originalError = error;
        return res.status(500).send(e);
    })
}