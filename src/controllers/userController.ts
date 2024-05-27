import { RequestHandler } from "express"
import { FirebaseAuth } from '../services/FirebaseAuth'
import { FirebaseStr } from '../services/FirebaseStr'
import { User_firebase_auth } from '../entities/user_firebase_auth'

const auth = new FirebaseAuth
const storage = new FirebaseStr

export const signUp: RequestHandler = (req, res) => {
    let user_request: User_firebase_auth = {
        ...req.body,
        emailVerified: req.body.emailVerified === 'true'
    }

    auth.createUser(user_request)
    .then((user_record) => {
        storage.savePicture(req.file, user_record.uid)
        .then((image_url) => {
            user_request.photoURL = image_url
            auth.updateUser(user_record.uid, user_request)
            .then(() => {
                res.status(201).send(user_record)
            }).catch((error) => {
                res.status(500).send(error.message)
            })
        }).catch((error) => {
            res.status(400).send(error.message)
        })
    }).catch((error) => {
        res.status(400).send(error.message)
    })
}

export const updateProfilePic: RequestHandler = (req, res) => {

    const jwt = req.headers.authorization?.split(' ')[1]

    if(jwt){
        auth.verifyJWT(jwt)
        .then((decodedIdToken) => {
            storage.savePicture(req.file, decodedIdToken.uid)
            .then((_url) => {
                res.status(201).send('User data updated successfuly')
            }).catch((error) => {
                res.status(403).send(error.message)
            })
        }).catch((error) => {
            res.status(401).send(error.message)
        })
    } else {
        res.status(400).send('JWT not found')
    }
}

export const updateUser: RequestHandler = (req, res) => {
    let user_request: User_firebase_auth = {
        ...req.body,
        emailVerified: req.body.emailVerified === 'true'
    }

    const jwt = req.headers.authorization?.split(' ')[1]

    if(jwt){
        auth.verifyJWT(jwt)
        .then((decodedIdToken) => {
            auth.updateUser(decodedIdToken.uid, user_request)
            .then(() => {
                res.status(201).send('User data updated successfuly')
            }).catch((error) => {
                res.status(400).send(error.message)
            })
        }).catch((error) => {
            res.status(401).send(error.message)
        })
    } else {
        res.status(500).send('JWT not found on request')
    }
}