import get from "axios"
import { RequestHandler } from "express"
import { MOVIE_API_HEADERS, MOVIE_URL, DEFAULT_MOVIE_REQUEST, BASE_URL, LANGUAGE_QUERY, BACKDROP_URL_PREFIX, POSTER_URL_PREFIX } from '../consts'
import { CarouselMovie } from "../entities/carouselMovie"
import { MoviePoster } from "../entities/moviePoster"
import { BasicActor } from "../entities/basicActor"
import { Actor, genderToString } from "../entities/actor"

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
        res.status(500).send(error)
    })
}

export const getMovie: RequestHandler = (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send({message: 'Bad request. Movie identifier needed'})

    const MOVIE_ID: string = req.query.movie_id as string
    const URL = BASE_URL + '/3/movie/' + MOVIE_ID + LANGUAGE_QUERY

    get(URL, {
        headers: MOVIE_API_HEADERS
    }).then((response) => {
        res.send(response.data)
    }).catch((error) => {
        res.status(500).send(error)
    }) 
}

export const getCredits: RequestHandler = (req, res) => {
    if(!req.query.movie_id)
        res.status(400).send({message: 'Bad request. Movie identifier needed'})

    const MOVIE_ID: string = req.query.movie_id as string
    const URL = BASE_URL + '/3/movie/' + MOVIE_ID + '/credits' + LANGUAGE_QUERY

    get(URL, {
        headers: MOVIE_API_HEADERS
    }).then((response) => {
        const shortResponse: BasicActor[] = response.data.cast
        .slice(0, 30)
        .map((actor: any) => ({
          id: actor.id,
          known_for_department: actor.known_for_department,
          name: actor.name,
          profile_path: (
            actor.profile_path ?
            POSTER_URL_PREFIX + actor.profile_path :
            actor.profile_path
        ),
          character: actor.character,
        }));
        res.status(200).send(shortResponse)
    }).catch((error) => {
        res.status(500).send(error)
    })
}

export const getActor: RequestHandler = (req, res) => {
    if(!req.query.actor_id)
        res.status(400).send({message: 'Bad request. Actor identifier needed'})

    const ACTOR_ID: string = req.query.actor_id as string
    const URL = BASE_URL + '/3/person/' + ACTOR_ID + LANGUAGE_QUERY

    get(URL, {
        headers: MOVIE_API_HEADERS
    }).then((response) => {
        const data = response.data;
        const actor: Actor = {
            biography: data.biography,
            birthday: data.birthday,
            deathday: data.deathday,
            gender: genderToString(data.gender),
            id: data.id,
            known_for_department: data.known_for_department,
            name: data.name,
            place_of_birth: data.place_of_birth,
            profile_path: (
                data.profile_path ?
                POSTER_URL_PREFIX + data.profile_path :
                data.profile_path
            )
        };
        res.status(200).send(actor)
    }).catch((error) => {
        res.status(500).send(error)
    })
}

export const getMoviesByActor: RequestHandler = (req, res) => {
    if (!req.query.actor_id) {
        res.status(400).send({ message: 'Bad request. Actor identifier needed' });
        return;
    }

    const ACTOR_ID: string = req.query.actor_id as string;
    const URL = BASE_URL + '/3/person/' + ACTOR_ID + '/movie_credits' + LANGUAGE_QUERY;

    get(URL, {
        headers: MOVIE_API_HEADERS
    }).then((response) => {
        const data = response.data;
        const movies: MoviePoster[] = data.cast.map((movie: any) => ({
            poster_path: (
                movie.poster_path ?
                POSTER_URL_PREFIX + movie.poster_path :
                movie.poster_path
            ),
            id: movie.id,
            title: movie.title
        }));

        res.status(200).send(movies);
    }).catch((error) => {
        res.status(500).send(error);
    });
};

export const getCarousel: RequestHandler = (_req, res) => {
    const URL = BASE_URL + '/3/discover/movie' + LANGUAGE_QUERY

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
        res.status(500).send(error)
    })
}

export const getHomeList: RequestHandler = (_req, res) => {
    const URL = BASE_URL + '/3/discover/movie' + LANGUAGE_QUERY

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
        res.status(500).send(error)
    })
}