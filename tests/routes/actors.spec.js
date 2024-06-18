"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../../src/app"));
const supertest_1 = __importDefault(require("supertest"));
describe('GET /actors/casting', () => {
    test('Should return code 500', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/actors/casting')
            .query({ movie_id: -1 }).send();
        expect(response.status).toBe(500);
    }));
    test('Should return code 200', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/actors/casting')
            .query({ movie_id: 558 }).send();
        expect(response.status).toBe(200);
    }));
    test('Should return Actor[]', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/actors/casting')
            .query({ movie_id: 558 }).send();
        const actors = JSON.parse(response.text);
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
    }));
});
describe('GET /actors', () => {
    test('Should return code 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/actors').send();
        expect(response.status).toBe(400);
    }));
    test('Should return code 500', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/actors')
            .query({ actor_id: -1 }).send();
        expect(response.status).toBe(500);
    }));
    test('Should return code 200', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/actors')
            .query({ actor_id: 194 }).send();
        expect(response.status).toBe(200);
    }));
    test('Should return ActorProfile', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/actors')
            .query({ actor_id: 194 }).send();
        const actor = JSON.parse(response.text);
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
    }));
});
describe('GET /actors/movies', () => {
    test('Should return code 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/actors/movies').send();
        expect(response.status).toBe(400);
    }));
    test('Should return code 500', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/actors/movies')
            .query({ actor_id: -1 }).send();
        expect(response.status).toBe(500);
    }));
    test('Should return code 200', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/actors/movies')
            .query({ actor_id: 194 }).send();
        expect(response.status).toBe(200);
    }));
    test('Should return Movies[]', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/actors/movies')
            .query({ actor_id: 194 }).send();
        const movies = JSON.parse(response.text);
        expect(Array.isArray(movies)).toBe(true);
        movies.forEach(movie => {
            expect(movie).toMatchObject({
                id: expect.any(Number),
                title: expect.any(String)
            });
            if (movie.poster_path) {
                expect(movie.poster_path).toEqual(expect.any(String));
            }
        });
    }));
});
