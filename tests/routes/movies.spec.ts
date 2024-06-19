import expressApp from "../../src/app";
import request from 'supertest'
import { MoviePoster } from "../../src/models/movie/moviePoster";
import { Movie } from "../../src/models/movie/movie";
import { CarouselMovie } from "../../src/models/movie/carouselMovie";

describe('GET /search', () => {
    test('Should return code 400', async () => {
        const response = await request(expressApp).get('/movies/search').send()
        expect(response.status).toBe(400)
    })

    test('Should return code 200', async () => {
        const response = await request(expressApp).get('/movies/search')
        .query({q: 'Inception'}).send()
        expect(response.status).toBe(200)
    })

    test('Should return MoviePoster[]', async () => {
        const response = await request(expressApp).get('/movies/search')
        .query({q: 'Inception'}).send()

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

describe('GET /', () => {
    test('Should return code 400', async () => {
        const response = await request(expressApp).get('/movies').send()
        expect(response.status).toBe(400)
    })

    test('Should return code 200', async () => {
        const response = await request(expressApp).get('/movies')
        .query({movie_id: 558}).send()
        expect(response.status).toBe(200)
    })

    test('Should return Movie', async () => {
        const response = await request(expressApp).get('/movies')
        .query({movie_id: 558}).send()

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

describe('GET /carousel', () => {
    test('Should return code 200', async () => {
        const response = await request(expressApp).get('/movies/carousel').send()
        expect(response.status).toBe(200)
    })

    test('Should return MoviePoster[]', async () => {
        const response = await request(expressApp).get('/movies/carousel').send()

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

describe('GET /home-list', () => {
    test('Should return code 200', async () => {
        const response = await request(expressApp).get('/movies/home-list').send()
        expect(response.status).toBe(200)
    })

    test('Should return MoviePoster[]', async () => {
        const response = await request(expressApp).get('/movies/home-list').send()

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