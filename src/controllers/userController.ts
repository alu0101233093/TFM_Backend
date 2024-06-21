import { RequestHandler } from "express"
import { FB_IMAGE_DEFAULT } from '../services/FirebaseStr'
import { UserFirebaseAuth } from '../models/user/userFirebaseAuth'
import { CustomError } from "../models/customError"
import { auth, database, storage } from "../app"

export const signUp: RequestHandler = (req, res) => {
    if(!req.body.email || !req.body.emailVerified || !req.body.password || !req.body.displayName){
        return res.status(400).send(new CustomError('Bad request.'))
    }

    let user_request: UserFirebaseAuth = {
        ...req.body,
        emailVerified: req.body.emailVerified ?? false,
        photoURL: FB_IMAGE_DEFAULT
    }

    auth.createUser(user_request)
    .then((user_record) => {
        storage.savePicture(req.file, user_record.uid)
        .then((image_url) => {
            user_request.photoURL = image_url
            auth.updateUser(user_record.uid, user_request)
            .then(() => {
                return res.status(201).send({message: 'User signed up'})
            }).catch((error) => {
                auth.deleteUser(user_record.uid)
                storage.deleteProfilePic(user_record.uid)
                return res.status(500).send(new CustomError('Error saving user information.', error))
            })
        }).catch((error) => {
            auth.deleteUser(user_record.uid)
            return res.status(500).send(error)
        })
    }).catch((error) => {
        return res.status(500).send(error)
    })
}

export const updateData: RequestHandler = (req, res) => {
    if(!req.body.email || !req.body.emailVerified || !req.body.password || !req.body.displayName){
        return res.status(400).send(new CustomError('Bad request.'))
    }

    const idToken = req.headers.authorization?.split(' ')[1]
    if (idToken) {
        auth.verifyIdToken(idToken)
        .then((decodedIdToken) => {
            let user_request: UserFirebaseAuth = {
                ...req.body,
                emailVerified: decodedIdToken.email_verified ?? false,
                photoURL: decodedIdToken.picture
            }
            if(req.file){
                storage.savePicture(req.file, decodedIdToken.uid)
                .then((url) => { 
                    user_request.photoURL = url 
                    auth.updateUser(decodedIdToken.uid, user_request) 
                    .then((_user_record) => {return res.status(200).send({message: 'User updated'})}) 
                    .catch((error) => {return res.status(500).send(new CustomError('Error saving user information.', error))})
                }).catch((error) => {
                    return res.status(500).send(error)
                })
            } else {
                auth.updateUser(decodedIdToken.uid, user_request)
                .then((_user_record) => {return res.status(200).send({message: 'User updated'})})
                .catch((error) => {return res.status(500).send(new CustomError('Error saving user information.', error))})
            }
        }).catch((error) => {
            return res.status(401).send(error)
        })
    } else {
        return res.status(400).send(new CustomError('IdToken not found on request'))
    }
}

export const deleteUser: RequestHandler = (req, res) => {
    const idToken = req.headers.authorization?.split(' ')[1]

    if (idToken) {
        auth.verifyIdToken(idToken)
        .then((decodedIdToken) => {
            Promise.all([
                auth.deleteUser(decodedIdToken.uid),
                storage.deleteProfilePic(decodedIdToken.uid),
                database.deleteUserReviews(decodedIdToken.uid)
            ])
            .then(() => {
                return res.status(200).send({message: 'User deleted successfuly'})
            })
            .catch((error) => {
                return res.status(500).send(error)
            });
        })
        .catch((error) => {
            return res.status(401).send(error)
        });
    } else {
        return res.status(400).send(new CustomError('IdToken not found on request'))
    }
}
