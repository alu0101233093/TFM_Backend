import express from 'express'
import { isValidEmail, singUpUser } from '../entities/singUpUser'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { equalTo, get, getDatabase, limitToFirst, orderByChild, query, ref, set } from "firebase/database"
// import { getStorage } from "firebase/storage";
import { firebaseApp } from '..'
import { logInUser } from '../entities/logInUser'
import { user_firebase_rtdb, user_firebase_rtdb_value } from '../entities/user_firebase_rtdb'

const auth = getAuth(firebaseApp)
const db = getDatabase(firebaseApp)
//const storage = getStorage(firebaseApp)

const user_router = express.Router()
user_router.use(express.urlencoded({ extended: true }))

user_router.post('/signup', (req, res) => {
    const user_request: singUpUser = req.body

    if(!isValidEmail(user_request.email))
        res.status(400).send('Bad Request. Wrong email format')

    createUserWithEmailAndPassword(auth, user_request.email, user_request.password)
    .then((user_credential) => {
        const user_db: user_firebase_rtdb_value = {
            ...user_request,
            profile_pic: ''
        }

        const user_db_ref = ref(db,'users/' + user_credential.user.uid)
        set(user_db_ref, user_db).then(() => {
            res.status(201).send('User signed up successfuly')
        }).catch((error) => {
            res.status(500).send(error.message)
        })
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