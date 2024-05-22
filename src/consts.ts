export const PORT = 3000
export const BASE_URL = 'https://api.themoviedb.org'
export const MOVIE_URL = BASE_URL + '/3/search/movie'
export const LANGUAGE_QUERY = '?language=es-ES'
export const FB_BUCKET_URL = 'miw-tfm-moviemeter.appspot.com'
export const FB_IMAGE_URL_PREFIX = 'https://firebasestorage.googleapis.com/v0/b/miw-tfm-moviemeter.appspot.com/o/users%2F'
export const FB_IMAGE_URL_SUFIX = '.png?alt=media'

export const DEFAULT_MOVIE_REQUEST = {
    include_adult: 'true',
    language: 'es-ES'
}

export const MOVIE_API_HEADERS = {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MmE0ODc1OTIwOWI0MmNmZmMzZjQ5OTc1MmRhODdlMCIsInN1YiI6IjY2M2I4YTY1OWYxZTYwNDM4ZTA0NWNkZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uNfVCc4C57I5gYrc9soA6_8sGA_PkC6zEo6T2wOGuXE'
}

export const firebaseConfig = {
    apiKey: "AIzaSyCfY0tF__7HF8SOFtFi9YsvGEmgWSeZ3p0",
    authDomain: "miw-tfm-moviemeter.firebaseapp.com",
    databaseURL: "https://miw-tfm-moviemeter-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "miw-tfm-moviemeter",
    storageBucket: "miw-tfm-moviemeter.appspot.com",
    messagingSenderId: "1052045701013",
    appId: "1:1052045701013:web:32d386bec0cf6ec25a509c"
  };