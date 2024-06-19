import expressApp from "../../src/app";
import request from 'supertest'
import { MoviePoster } from "../../src/models/movie/moviePoster";
import { Movie } from "../../src/models/movie/movie";
import { CarouselMovie } from "../../src/models/movie/carouselMovie";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { BASE_URL, MOVIE_URL } from "../../src/consts";
import { GetCarouselResponse, GetMovieResponse, SearchMovieResponse } from "../mockResponses/mockAxiosResponses";

let mock: MockAdapter;

describe('GET /movies/search', () => {
    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    test('Should return code 400', async () => {
        const response = await request(expressApp).get('/movies/search')
        expect(response.status).toBe(400)
    })

    test('Should return code 500', async () => {
        mock.onGet(MOVIE_URL).reply(500, 'API server not working')
        const response = await request(expressApp).get('/movies/search')
        .query({q: 'Inception'})
        expect(response.status).toBe(500)
    })

    test('Should return code 200', async () => {
        mock.onGet(MOVIE_URL).reply(200, SearchMovieResponse)
        const response = await request(expressApp).get('/movies/search')
        .query({q: 'Inception'})
        expect(response.status).toBe(200)
    })

    test('Should return MoviePoster[]', async () => {
        mock.onGet(MOVIE_URL).reply(200, SearchMovieResponse)

        const response = await request(expressApp).get('/movies/search')
        .query({q: 'Inception'})

        const movies: MoviePoster[] = JSON.parse(response.text);
        expect(Array.isArray(movies)).toBe(true);

        movies.forEach(movie => {
            expect(movie).toMatchObject({
                id: expect.any(Number),
                title: expect.any(String)
            });

            movie.poster_path ? expect(movie.poster_path).toEqual(expect.any(String)) : expect(movie.poster_path).toEqual(null)
        });
    })
})

describe('GET /movies', () => {
    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    test('Should return code 400', async () => {
        const response = await request(expressApp).get('/movies')
        expect(response.status).toBe(400)
    })

    test('Should return code 500', async () => {
        mock.onGet(BASE_URL + '/3/movie/558').reply(500, 'API server not working')
        const response = await request(expressApp).get('/movies')
        .query({movie_id: 558})
        expect(response.status).toBe(500)
    })

    test('Should return code 200', async () => {
        mock.onGet(BASE_URL + '/3/movie/558').reply(200, GetMovieResponse)
        const response = await request(expressApp).get('/movies')
        .query({movie_id: 558})
        expect(response.status).toBe(200)
    })

    test('Should return Movie', async () => {
        mock.onGet(BASE_URL + '/3/movie/558').reply(200, GetMovieResponse)
        const response = await request(expressApp).get('/movies')
        .query({movie_id: 558})

        const movie: Movie = JSON.parse(response.text);

        expect(movie).toMatchObject({
            budget: expect.any(Number),
            genres: expect.any(Array),
            id: expect.any(Number),
            overview: expect.any(String),
            poster_path: expect.any(String),
            release_date: expect.any(String),
            revenue: expect.any(Number),
            runtime: expect.any(Number),
            status: expect.any(String),
            title: expect.any(String)
        });

        movie.genres.forEach(genre => {
            expect(genre).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String)
            });
        });
    })
})

describe('GET /movies/carousel', () => {
    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    test('Should return code 500', async () => {
        mock.onGet(BASE_URL + '/3/discover/movie').reply(500, 'API server not working')
        const response = await request(expressApp).get('/movies/carousel')
        .query({movie_id: 558})
        expect(response.status).toBe(500)
    })

    test('Should return code 200', async () => {
        mock.onGet(BASE_URL + '/3/discover/movie').reply(200, GetCarouselResponse)
        const response = await request(expressApp).get('/movies/carousel')
        expect(response.status).toBe(200)
    })

    test('Should return MoviePoster[]', async () => {
        mock.onGet(BASE_URL + '/3/discover/movie').reply(200, GetCarouselResponse)
        const response = await request(expressApp).get('/movies/carousel')

        const movies: CarouselMovie[] = JSON.parse(response.text);
        expect(Array.isArray(movies)).toBe(true);

        movies.forEach(movie => {
            expect(movie).toMatchObject({
                id: expect.any(Number),
                title: expect.any(String),
                overview: expect.any(String),
                backdrop_path: expect.any(String),
            });
        });
    })
})

describe('GET /movies/home-list', () => {
    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    test('Should return code 500', async () => {
        mock.onGet(BASE_URL + '/3/discover/movie').reply(500, 'API server not working')
        const response = await request(expressApp).get('/movies/home-list')
        .query({movie_id: 558})
        expect(response.status).toBe(500)
    })

    test('Should return code 200', async () => {
        mock.onGet(BASE_URL + '/3/discover/movie').reply(200, SearchMovieResponse)
        const response = await request(expressApp).get('/movies/home-list')
        expect(response.status).toBe(200)
    })

    test('Should return MoviePoster[]', async () => {
        mock.onGet(BASE_URL + '/3/discover/movie').reply(200, SearchMovieResponse)
        const response = await request(expressApp).get('/movies/home-list')

        const movies: MoviePoster[] = JSON.parse(response.text);
        expect(Array.isArray(movies)).toBe(true);

        movies.forEach(movie => {
            expect(movie).toMatchObject({
                id: expect.any(Number),
                title: expect.any(String)
            });

            movie.poster_path ? expect(movie.poster_path).toEqual(expect.any(String)) : expect(movie.poster_path).toEqual(null)
        });
    })
})