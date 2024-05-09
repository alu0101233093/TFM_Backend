import express from 'express'
import { isValidEmail, singUpUser } from '../entities/singUpUser'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { equalTo, get, getDatabase, limitToFirst, orderByChild, query, ref } from "firebase/database"
import { firebaseApp } from '..'
import { logInUser } from '../entities/logInUser'
import { user_firebase_rtdb } from '../entities/user_firebase_rtdb'

const auth = getAuth(firebaseApp)
const db = getDatabase(firebaseApp)

const user_router = express.Router()
user_router.use(express.urlencoded({ extended: true }))

user_router.post('/signup', (req, res) => {
    const user: singUpUser = req.body

    if(!isValidEmail(user.email))
        res.status(400).send('Bad Request. Wrong email format')

    createUserWithEmailAndPassword(auth,user.email,user.password)
    .then((userCredential) => {
        res.status(201).send(userCredential.user)
    })
    .catch((error) => {
        res.status(500).send(error.message)
    })
})

user_router.get('/login', (req, res) => {
    const user: logInUser = req.body

    getEmailByUsername(user.username)
    .then(email => {
        if(email == '') res.status(401).send('User not found')

        signInWithEmailAndPassword(auth, email, user.password)
        .then(() => {
            res.status(200).send()
        }).catch((error) => {
            res.status(500).send(error.message)
        })
    }).catch((error) => {
        res.status(500).send(error.message)
    })
})

export default user_router

async function getEmailByUsername(username: string) {
    const resultPath = query(ref(db, 'users'), orderByChild('username'), equalTo(username), limitToFirst(1))
    const result = await get(resultPath)
    if (result.exists()) {
        const userData: user_firebase_rtdb = result.val()
        return Object.values(userData)[0].email
    } else {
        return ''
    }
}