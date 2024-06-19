export const ActorArrayResponse = {cast: [{
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

export const ActorProfilesResponse = {
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


export const MoviePosterArrayResponse = {
    cast: [
        {
            poster_path: '/path/to/movie1.jpg',
            id: 1,
            title: 'Movie Title 1'
        },
        {
            poster_path: '/path/to/movie2.jpg',
            id: 2,
            title: 'Movie Title 2'
        },
        {
            poster_path: '/path/to/movie3.jpg',
            id: 3,
            title: 'Movie Title 3'
        },
        {
            poster_path: '/path/to/movie4.jpg',
            id: 4,
            title: 'Movie Title 4'
        }
    ]
};