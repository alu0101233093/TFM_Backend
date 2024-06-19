export const GetCastingResponse = {cast: [{
    id: 1,
    known_for_department: 'Acting',
    name: 'Actor Name',
    profile_path: '/path/to/profile.jpg',
    character: 'Character Name'
},
{
    id: 2,
    known_for_department: 'Acting',
    name: 'Actor Name',
    profile_path: '/path/to/profile.jpg',
    character: 'Character Name'
}]}

export const GetActorProfileResponse = {
    id: 1,
    name: 'Actor 1',
    biography: 'Biography of Actor 1',
    birthday: '2000-01-01',
    deathday: '2020-01-01',
    gender: 0,
    known_for_department: 'Acting',
    place_of_birth: 'Los Angeles, USA',
    profile_path: '/profiles/actor_1.jpg'
}

export const GetMoviesByActorResponse = {
    cast: [{
        poster_path: '/path/to/movie1.jpg',
        id: 1,
        title: 'Movie Title 1'
    },
    {
        poster_path: '/path/to/movie2.jpg',
        id: 2,
        title: 'Movie Title 2'
    }]
};

export const SearchMovieResponse = {
    results: [{
        poster_path: '/path/to/movie1.jpg',
        id: 1,
        title: 'Movie Title 1'
    },
    {
        poster_path: '/path/to/movie2.jpg',
        id: 2,
        title: 'Movie Title 2'
    }]
};

export const GetMovieResponse = {
    budget: 100000000,
    genres: [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
        { id: 878, name: 'Science Fiction' }
    ],
    id: 12345,
    overview: 'This is a fictional movie overview.',
    poster_path: '/path/to/poster.jpg',
    release_date: '2023-01-01',
    revenue: 500000000,
    runtime: 150,
    status: 'Released',
    title: 'Example Movie'
};

export const GetCarouselResponse = {
    results: [{
        backdrop_path: '/path/to/movie1.jpg',
        id: 1,
        title: 'Movie Title 1',
        overview: 'This is a fictional movie overview.'
    },
    {
        backdrop_path: '/path/to/movie2.jpg',
        id: 2,
        title: 'Movie Title 2',
        overview: 'This is a fictional movie overview.'
    }]
};