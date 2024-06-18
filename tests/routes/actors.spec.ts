import expressApp from "../../src/app";
import request from 'supertest'
import { Actor } from "../../src/models/actor/actor";
import { ActorProfile } from "../../src/models/actor/actorProfile";
import { MoviePoster } from "../../src/models/movie/moviePoster";

describe('GET /actors/casting', () => {
    test('Should return code 500', async () => {
        const response = await request(expressApp).get('/actors/casting')
        .query({movie_id: -1}).send()

        expect(response.status).toBe(500)
    })

    test('Should return code 200', async () => {
        const response = await request(expressApp).get('/actors/casting')
        .query({movie_id: 558}).send()

        expect(response.status).toBe(200)
    })

    test('Should return Actor[]', async () => {
        const response = await request(expressApp).get('/actors/casting')
        .query({movie_id: 558}).send()

        const actors: Actor[] = JSON.parse(response.text);
        expect(Array.isArray(actors)).toBe(true);

        actors.forEach(actor => {
            expect(actor).toMatchObject({
                id: expect.any(Number),
                known_for_department: expect.any(String),
                name: expect.any(String),
                profile_path: expect.any(String),
                character: expect.any(String)
            });
        });
    })
})

describe('GET /actors', () => {
    test('Should return code 400', async () => {
        const response = await request(expressApp).get('/actors').send()
        expect(response.status).toBe(400)
    })

    test('Should return code 500', async () => {
        const response = await request(expressApp).get('/actors')
        .query({actor_id: -1}).send()
        expect(response.status).toBe(500)
    })

    test('Should return code 200', async () => {
        const response = await request(expressApp).get('/actors')
        .query({actor_id: 194}).send()
        expect(response.status).toBe(200)
    })

    test('Should return ActorProfile', async () => {
        const response = await request(expressApp).get('/actors')
        .query({actor_id: 194}).send()

        const actor: ActorProfile = JSON.parse(response.text);

        expect(actor).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
            biography: expect.any(String),
            birthday: expect.any(String),
            deathday: expect.any(String),
            gender: expect.any(String),
            known_for_department: expect.any(String),
            place_of_birth: expect.any(String),
            profile_path: expect.any(String)
        });
    })
})

describe('GET /actors/movies', () => {
    test('Should return code 400', async () => {
        const response = await request(expressApp).get('/actors/movies').send()
        expect(response.status).toBe(400)
    })

    test('Should return code 500', async () => {
        const response = await request(expressApp).get('/actors/movies')
        .query({actor_id: -1}).send()
        expect(response.status).toBe(500)
    })

    test('Should return code 200', async () => {
        const response = await request(expressApp).get('/actors/movies')
        .query({actor_id: 194}).send()
        expect(response.status).toBe(200)
    })

    test('Should return Movies[]', async () => {
        const response = await request(expressApp).get('/actors/movies')
        .query({actor_id: 194}).send()

        const movies: MoviePoster[] = JSON.parse(response.text);
        expect(Array.isArray(movies)).toBe(true);

        movies.forEach(movie => {
            expect(movie).toMatchObject({
                id: expect.any(Number),
                title: expect.any(String)
            });

            if(movie.poster_path){
                expect(movie.poster_path).toEqual(expect.any(String))
            }
        });
    })
})