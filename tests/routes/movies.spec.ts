import expressApp from "../../src/app";
import request from 'supertest'
import { Actor } from "../../src/models/actor/actor";
import { ActorProfile } from "../../src/models/actor/actorProfile";
import { MoviePoster } from "../../src/models/movie/moviePoster";

describe('GET /search', () => {
    test('Should return code 400', async () => {
        const response = await request(expressApp).get('/movies/search')
        .query({movie_id: -1}).send()

        expect(response.status).toBe(400)
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