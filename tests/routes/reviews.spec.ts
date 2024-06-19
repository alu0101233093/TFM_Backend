import expressApp from "../../src/app";
import request from 'supertest'

describe('POST /reviews', () => {
    test('Should return code 400', async () => {
        const response = await request(expressApp).post('/reviews').send()
        expect(response.status).toBe(400)
    })

    test('Should return code 400', async () => {
        const response = await request(expressApp).post('/reviews').
        query({movie_id: 558}).send()
        expect(response.status).toBe(400)
    })
})