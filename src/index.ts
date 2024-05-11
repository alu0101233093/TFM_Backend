import express from 'express'
import { PORT, firebaseConfig } from './consts'
import { initializeApp } from 'firebase/app'

export const firebaseApp = initializeApp(firebaseConfig);

import movie_router from './routes/movies'
import user_router from './routes/users'

const expressApp = express()

expressApp.use('/movies', movie_router)
expressApp.use('/users', user_router)

expressApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})