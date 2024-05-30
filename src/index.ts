import express from 'express'
import { PORT, firebaseConfig } from './consts'
import { initializeApp } from 'firebase/app'
import * as admin from 'firebase-admin'
import { credential } from 'firebase-admin'

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAdminApp = admin.initializeApp({
    credential: credential.cert('miw-tfm-moviemeter-firebase-adminsdk-y4a07-184e00d3ed.json'),
    databaseURL: "https://miw-tfm-moviemeter-default-rtdb.europe-west1.firebasedatabase.app"
  });

import movie_router from './routes/movies'
import user_router from './routes/users'
import cors from 'cors'
import { swaggerDocs } from './swagger'

const expressApp = express()

expressApp.use(cors({ origin: 'http://localhost:4200' }))

expressApp.use('/movies', movie_router)
expressApp.use('/users', user_router)

expressApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    swaggerDocs(expressApp, PORT)
})