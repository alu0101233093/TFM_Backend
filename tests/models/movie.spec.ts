import { CarouselMovie } from "../../src/models/movie/carouselMovie";
import { Genre, Movie } from "../../src/models/movie/movie";
import { MoviePoster } from "../../src/models/movie/moviePoster";

describe('CarouselMovie Model', () => {
    test('should create a carousel movie with correct properties', () => {
        const carouselMovie: CarouselMovie = {
            backdrop_path: '/path/to/backdrop.jpg',
            id: 1,
            title: 'Movie Title',
            overview: 'Movie overview text'
        };

        expect(carouselMovie).toHaveProperty('backdrop_path', '/path/to/backdrop.jpg');
        expect(carouselMovie).toHaveProperty('id', 1);
        expect(carouselMovie).toHaveProperty('title', 'Movie Title');
        expect(carouselMovie).toHaveProperty('overview', 'Movie overview text');
    });
});

describe('Genre Model', () => {
    test('should create a genre with correct properties', () => {
        const genre: Genre = {
            id: 1,
            name: 'Action'
        };

        expect(genre).toHaveProperty('id', 1);
        expect(genre).toHaveProperty('name', 'Action');
    });
});

describe('Movie Model', () => {
    test('should create a movie with correct properties', () => {
        const genres: Genre[] = [
            { id: 1, name: 'Action' },
            { id: 2, name: 'Adventure' }
        ];

        const movie: Movie = {
            budget: 200000000,
            genres: genres,
            id: 1,
            overview: 'Movie overview text',
            poster_path: '/path/to/poster.jpg',
            release_date: '2024-06-20',
            revenue: 1000000000,
            runtime: 120,
            status: 'Released',
            title: 'Movie Title'
        };

        expect(movie).toHaveProperty('budget', 200000000);
        expect(movie).toHaveProperty('genres', genres);
        expect(movie).toHaveProperty('id', 1);
        expect(movie).toHaveProperty('overview', 'Movie overview text');
        expect(movie).toHaveProperty('poster_path', '/path/to/poster.jpg');
        expect(movie).toHaveProperty('release_date', '2024-06-20');
        expect(movie).toHaveProperty('revenue', 1000000000);
        expect(movie).toHaveProperty('runtime', 120);
        expect(movie).toHaveProperty('status', 'Released');
        expect(movie).toHaveProperty('title', 'Movie Title');
    });
});

describe('MoviePoster Model', () => {
    test('should create a movie poster with correct properties', () => {
        const moviePoster: MoviePoster = {
            poster_path: '/path/to/poster.jpg',
            id: 1,
            title: 'Movie Title'
        };

        expect(moviePoster).toHaveProperty('poster_path', '/path/to/poster.jpg');
        expect(moviePoster).toHaveProperty('id', 1);
        expect(moviePoster).toHaveProperty('title', 'Movie Title');
    });
});
