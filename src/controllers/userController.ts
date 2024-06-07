import { RequestHandler } from "express"
import { FirebaseAuth } from '../services/FirebaseAuth'
import { FB_IMAGE_DEFAULT, FirebaseStr } from '../services/FirebaseStr'
import { User_firebase_auth } from '../entities/user_firebase_auth'
import { FirebaseRTDB } from "../services/FirebaseRTDB"

const auth = new FirebaseAuth
const storage = new FirebaseStr
const database = new FirebaseRTDB

export const signUp: RequestHandler = (req, res) => {
    let user_request: User_firebase_auth = {
        ...req.body,
        emailVerified: req.body.emailVerified === 'true',
        photoURL: FB_IMAGE_DEFAULT
    }

    auth.createUser(user_request)
    .then((user_record) => {
        storage.savePicture(req.file, user_record.uid)
        .then((image_url) => {
            user_request.photoURL = image_url
            auth.updateUser(user_record.uid, user_request)
            .then(() => {
                res.status(201).send({message: 'User signed up'})
            }).catch((error) => {
                auth.deleteUser(user_record.uid)
                storage.deleteProfilePic(user_record.uid)
                res.status(500).send(error)
            })
        }).catch((error) => {
            auth.deleteUser(user_record.uid)
            res.status(400).send(error)
        })
    }).catch((error) => {
        res.status(400).send(error)
    })
}

export const updateProfilePic: RequestHandler = (req, res) => {

    const idToken = req.headers.authorization?.split(' ')[1]

    if(idToken){
        auth.verifyIdToken(idToken)
        .then((decodedIdToken) => {
            storage.savePicture(req.file, decodedIdToken.uid)
            .then((_url) => {
                res.status(201).send('User data updated successfuly')
            }).catch((error) => {
                res.status(403).send(error)
            })
        }).catch((error) => {
            res.status(401).send(error)
        })
    } else {
        res.status(400).send('idToken not found')
    }
}

export const updateUser: RequestHandler = (req, res) => {
    let user_request: User_firebase_auth = {
        ...req.body,
        emailVerified: req.body.emailVerified === 'true'
    }

    const idToken = req.headers.authorization?.split(' ')[1]

    if(idToken){
        auth.verifyIdToken(idToken)
        .then((decodedIdToken) => {
            auth.updateUser(decodedIdToken.uid, user_request)
            .then(() => {
                res.status(201).send('User data updated successfuly')
            }).catch((error) => {
                res.status(400).send(error)
            })
        }).catch((error) => {
            res.status(401).send(error)
        })
    } else {
        res.status(400).send('IdToken not found on request')
    }
}

export const deleteUser: RequestHandler = (req, res) => {
    if(req.headers.authorization){
        const idToken: string = req.headers.authorization?.split(' ')[1]
        auth.verifyIdToken(idToken)
        .then((decodedIdToken) => {
            auth.deleteUser(decodedIdToken.uid).catch((error) => {
                res.status(500).send(error)
            })
            storage.deleteProfilePic(decodedIdToken.uid).catch((error) => {
                res.status(500).send(error)
            })
            database.deleteUserReviews(decodedIdToken.uid).catch((error) => {
                res.status(500).send(error)
            })
            res.status(200).send('User deleted successfuly')
        }).catch((error) => {
            res.status(401).send(error)
        })
    } else {
        res.status(400).send('IdToken not found on request')
    }
}