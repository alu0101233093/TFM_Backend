import express from 'express'
import multer from 'multer'
import { singUpUser } from '../entities/singUpUser'
import { logInUser } from '../entities/logInUser'
import { FirebaseAuth } from '../classes/FirebaseAuth'
import { FirebaseRTDB } from '../classes/FirebaseRTDB'
import { FirebaseStr } from '../classes/FirebaseStr'

const auth = new FirebaseAuth
const db = new FirebaseRTDB
const storage = new FirebaseStr

const user_router = express.Router()
const upload = multer({
    storage: multer.memoryStorage()
});

user_router.post('/signup', upload.single('profile_pic'), (req, res) => {
    const user_request: singUpUser = {
        ...req.body,
        profile_pic: req.file
    }
    console.log(user_request)

    auth.createUser(user_request.email,user_request.password)
    .then((user_credential) => {
        storage.savePicture(user_request.profile_pic, user_credential.user.uid)
        .then((image_url) => {
            db.setUser(user_request, user_credential.user.uid, image_url)
            .then(() => {
                res.status(201).send('User signed up successfuly')
            }).catch((error) => {
                res.status(500).send(error.message)
            })
        }).catch((error) => {
            res.status(400).send(error.message)
        })
    }).catch((error) => {
        res.status(400).send(error.message)
    })
})

user_router.get('/login', (req, res) => {
    const user: logInUser = req.body
    
    db.getEmailByUsername(user.username)
    .then((email) => {
        auth.logIn(email, user.password)
        .then(() => {
            res.status(200).send('User loged in successfuly')
        }).catch((error) => {
            res.status(401).send(error.message)
        })
    }).catch((error) => {
        res.status(404).send(error.message)
    })
})

export default user_router