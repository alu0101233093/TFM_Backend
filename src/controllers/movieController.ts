import get from "axios"
import { RequestHandler } from "express"
import { MOVIE_API_HEADERS, MOVIE_URL, DEFAULT_MOVIE_REQUEST, BASE_URL, LANGUAGE_QUERY } from '../consts'
import { CarouselMovie } from "../entities/carouselMovie"
import { MoviePoster } from "../entities/moviePoster"

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
            poster_path: 'https://media.themoviedb.org/t/p/original/' + movie.poster_path,
            id: movie.id,
            title: movie.title,
        }))
        res.json(MOVIES)
    }).catch(() => {
        res.status(500).send('Internal server error')
    })
}

export const getMovie: RequestHandler = (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')

    const MOVIE_ID: string = req.query.movie_id as string
    const URL = BASE_URL + '/3/movie/' + MOVIE_ID + LANGUAGE_QUERY

    get(URL, {
        headers: MOVIE_API_HEADERS
    }).then((response) => {
        res.send(response.data)
    }).catch(() => {
        res.status(500).send('Internal server error')
    }) 
}

export const getCredits: RequestHandler = (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send('Bad request. Movie identifier needed')

    const MOVIE_ID: string = req.query.movie_id as string
    const URL = BASE_URL + '/3/movie/' + MOVIE_ID + '/credits' + LANGUAGE_QUERY

    get(URL, {
        headers: MOVIE_API_HEADERS
    }).then((response) => {
        res.send(response.data)
    }).catch(() => {
        res.status(500).send('Internal server error')
    })
}

export const getCarousel: RequestHandler = (_req, res) => {
    const URL = BASE_URL + '/3/discover/movie' + LANGUAGE_QUERY

    get(URL, {
        headers: MOVIE_API_HEADERS
    }).then((response) => {
        const MOVIES: CarouselMovie[] = response.data.results.map((movie: any) => ({
            backdrop_path: 'https://media.themoviedb.org/t/p/w1920_and_h800_bestv2' + movie.backdrop_path,
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
        }))
        res.json(MOVIES)
    }).catch(() => {
        res.status(500).send('Internal server error')
    })
}

export const getHomeList: RequestHandler = (_req, res) => {
    const URL = BASE_URL + '/3/discover/movie' + LANGUAGE_QUERY

    get(URL, {
        headers: MOVIE_API_HEADERS
    }).then((response) => {
        const MOVIES: MoviePoster[] = response.data.results.map((movie: any) => ({
            poster_path: 'https://media.themoviedb.org/t/p/original/' + movie.poster_path,
            id: movie.id,
            title: movie.title,
        }))
        res.json(MOVIES)
    }).catch(() => {
        res.status(500).send('Internal server error')
    })
}