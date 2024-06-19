import expressApp from "../../src/app";
import request from 'supertest'
import { MoviePoster } from "../../src/models/movie/moviePoster";

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