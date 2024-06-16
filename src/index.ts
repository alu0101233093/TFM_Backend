import express from 'express'
import cors from 'cors'
import { PORT, DATABASE_URL, FRONTEND_URL, FIREBASE_ADMIN_CREDENTIALS } from './consts'
import { credential } from 'firebase-admin'
import { swaggerDocs } from './swagger'
import * as admin from 'firebase-admin'

export const firebaseAdminApp = admin.initializeApp({
  credential: credential.cert(FIREBASE_ADMIN_CREDENTIALS),
  databaseURL: DATABASE_URL
});

import movie_router from './routes/movies'
import reviews_router from './routes/reviews'
import user_router from './routes/users'
import verification_router from './routes/verification'

const expressApp = express()

expressApp.use(cors({ origin: FRONTEND_URL }))

expressApp.use('/movies', movie_router)
expressApp.use('/reviews', reviews_router)
expressApp.use('/users', user_router)
expressApp.use('/verification', verification_router)

expressApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    swaggerDocs(expressApp, PORT)
})