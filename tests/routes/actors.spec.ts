import expressApp from "../../src/app";
import request from 'supertest'
import { Actor } from "../../src/models/actor/actor";
import { ActorProfile } from "../../src/models/actor/actorProfile";
import { MoviePoster } from "../../src/models/movie/moviePoster";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { BASE_URL } from "../../src/consts";
import { ActorArrayResponse, ActorProfilesResponse, MoviePosterArrayResponse } from "../mockResponses/mockAxiosResponses";

let mock: MockAdapter;

describe('GET /actors/casting', () => {
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
        const response = await request(expressApp).get('/actors/casting')
        expect(response.status).toBe(400)
    })
    
    test('Should return code 500', async () => {
        mock.onGet(BASE_URL + '/3/movie/558/credits').reply(500, 'API server not working')
        const response = await request(expressApp).get('/actors/casting')
        .query({movie_id: 558})

        expect(response.status).toBe(500)
    })    

    test('Should return code 200', async () => {
        let axiosResponse = ActorArrayResponse
        mock.onGet(BASE_URL + '/3/movie/558/credits').reply(200, axiosResponse)
        const response = await request(expressApp).get('/actors/casting')
        .query({movie_id: 558})

        expect(response.status).toBe(200)
    })

    test('Should return Actor[]', async () => {
        let axiosResponse = ActorArrayResponse
        
        mock.onGet(BASE_URL + '/3/movie/558/credits').reply(200, axiosResponse)
        const response = await request(expressApp).get('/actors/casting')
        .query({movie_id: 558})

        const actors: Actor[] = response.body;
        expect(Array.isArray(actors)).toBe(true);

        actors.forEach(actor => {
            expect(actor).toMatchObject({
                id: expect.any(Number),
                known_for_department: expect.any(String),
                name: expect.any(String),
                character: expect.any(String)
            });

            actor.profile_path ? expect(actor.profile_path).toEqual(expect.any(String)) : expect(actor.profile_path).toEqual(null)
        });
    })
})

describe('GET /actors', () => {
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
        const response = await request(expressApp).get('/actors')
        expect(response.status).toBe(400)
    })

    test('Should return code 500', async () => {
        mock.onGet(BASE_URL + '/3/person/194').reply(500, 'API server not working')
        const response = await request(expressApp).get('/actors')
        .query({actor_id: 194})
        expect(response.status).toBe(500)
    })

    test('Should return code 200', async () => {
        let axiosResponse = ActorProfilesResponse
        mock.onGet(BASE_URL + '/3/person/194').reply(200, axiosResponse)
        const response = await request(expressApp).get('/actors')
        .query({actor_id: 194})
        expect(response.status).toBe(200)
    })

    test('Should return ActorProfile', async () => {
        let axiosResponse = ActorProfilesResponse
        mock.onGet(BASE_URL + '/3/person/194').reply(200, axiosResponse)

        const response = await request(expressApp).get('/actors')
        .query({actor_id: 194})

        const actor: ActorProfile = JSON.parse(response.text);

        expect(actor).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
            biography: expect.any(String),
            birthday: expect.any(String),
            gender: expect.any(String),
            known_for_department: expect.any(String),
            place_of_birth: expect.any(String)
        });

        actor.deathday ? expect(actor.deathday).toEqual(expect.any(String)) : expect(actor.deathday).toEqual(null)
        actor.profile_path ? expect(actor.profile_path).toEqual(expect.any(String)) : expect(actor.profile_path).toEqual(null)
    })
})

describe('GET /actors/movies', () => {

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
        const response = await request(expressApp).get('/actors/movies')
        expect(response.status).toBe(400)
    })

    test('Should return code 500', async () => {
        mock.onGet(BASE_URL + '/3/person/194/movie_credits').reply(500, 'API server not working')
        const response = await request(expressApp).get('/actors/movies')
        .query({actor_id: 194})
        expect(response.status).toBe(500)
    })

    test('Should return code 200', async () => {
        let axiosResponse = MoviePosterArrayResponse;
        mock.onGet(BASE_URL + '/3/person/194/movie_credits').reply(200, axiosResponse)
        const response = await request(expressApp).get('/actors/movies')
        .query({actor_id: 194})
        expect(response.status).toBe(200)
    })

    test('Should return Movies[]', async () => {
        let axiosResponse = MoviePosterArrayResponse;
        mock.onGet(BASE_URL + '/3/person/194/movie_credits').reply(200, axiosResponse)
        
        const response = await request(expressApp).get('/actors/movies')
        .query({actor_id: 194})

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