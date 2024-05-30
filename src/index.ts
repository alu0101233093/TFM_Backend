import express from 'express'
import cors from 'cors'
import { PORT, firebaseConfig } from './consts'
import { credential } from 'firebase-admin'
import { swaggerDocs } from './swagger'
import * as admin from 'firebase-admin'

export const firebaseAdminApp = admin.initializeApp({
  credential: credential.cert('miw-tfm-moviemeter-firebase-adminsdk-y4a07-184e00d3ed.json'),
  databaseURL: firebaseConfig.databaseURL
});

import movie_router from './routes/movies'
import user_router from './routes/users'

const expressApp = express()

expressApp.use(cors({ origin: 'http://localhost:4200' }))

expressApp.use('/movies', movie_router)
expressApp.use('/users', user_router)

expressApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    swaggerDocs(expressApp, PORT)
})