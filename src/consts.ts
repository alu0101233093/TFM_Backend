import dotenv from 'dotenv'
import { ServiceAccount } from 'firebase-admin'
dotenv.config()

export const PORT = parseInt(process.env.PORT || '3000', 10)
export const BASE_URL = process.env.BASE_URL || 'https://api.themoviedb.org'
export const MOVIE_URL = process.env.MOVIE_URL || `${BASE_URL}/3/search/movie`
export const BACKDROP_URL_PREFIX = 'https://media.themoviedb.org/t/p/w1920_and_h800_bestv2'
export const POSTER_URL_PREFIX = 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2'
export const LANGUAGE_QUERY = process.env.LANGUAGE_QUERY || '?language=es-ES'

export const FB_BUCKET_URL = process.env.FB_BUCKET_URL || 'miw-tfm-moviemeter.appspot.com'
export const FB_IMAGE_URL_PREFIX = process.env.FB_IMAGE_URL_PREFIX || 'https://firebasestorage.googleapis.com/v0/b/miw-tfm-moviemeter.appspot.com/o/users%2F'
export const FB_IMAGE_URL_SUFIX = process.env.FB_IMAGE_URL_SUFIX || '.png?alt=media'

export const DEFAULT_MOVIE_REQUEST = {
    include_adult: process.env.DEFAULT_MOVIE_REQUEST_INCLUDE_ADULT === 'true',
    language: process.env.DEFAULT_MOVIE_REQUEST_LANGUAGE || 'es-ES'
}

export const MOVIE_API_HEADERS = {
    accept: process.env.MOVIE_API_ACCEPT || 'application/json',
    Authorization: process.env.MOVIE_API_AUTHORIZATION || ''
}

export const DATABASE_URL = process.env.FIREBASE_DATABASE_URL || ''
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200'

export const FIREBASE_ADMIN_CREDENTIALS: ServiceAccount = {
    projectId: process.env.FIREBASE_CERT_PROJECT_ID || '',
    privateKey: process.env.FIREBASE_CERT_PRIVATE_KEY || '',
    clientEmail: process.env.FIREBASE_CERT_CLIENT_MAIL || ''
}
  