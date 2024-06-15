import { RequestHandler, Response } from "express"
import { FirebaseAuth } from '../services/FirebaseAuth'
import { FB_IMAGE_DEFAULT, FirebaseStr } from '../services/FirebaseStr'
import { UserFirebaseAuth } from '../entities/userFirebaseAuth'
import { FirebaseRTDB } from "../services/FirebaseRTDB"
import { VerificationRequest } from "../entities/verificationRequest"

const auth = new FirebaseAuth
const storage = new FirebaseStr
const database = new FirebaseRTDB

export const signUp: RequestHandler = (req, res) => {
    let user_request: UserFirebaseAuth = {
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
                            res.status(201).send({ message: 'User signed up' })
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

export const updateData: RequestHandler = (req, res) => {
    const idToken = req.headers.authorization?.split(' ')[1]

    if (idToken) {
        auth.verifyIdToken(idToken)
        .then((decodedIdToken) => {
            let user_request: UserFirebaseAuth = {
                ...req.body,
                emailVerified: decodedIdToken.email_verified == true,
                photoURL: decodedIdToken.picture
            }
            if(req.file){
                storage.savePicture(req.file, decodedIdToken.uid)
                .then((url) => {
                    user_request.photoURL = url
                    updateUser(decodedIdToken.uid, user_request, res);
                }).catch((error) => {
                    res.status(500).send(error)
                })
            } else {
                updateUser(decodedIdToken.uid, user_request, res)
            }
        }).catch((error) => {
            res.status(401).send(error)
        })
    }
}

const updateUser = (uid: string, user: UserFirebaseAuth, res: Response) => {
    auth.updateUser(uid, user)
    .then((_user_record) => {
        res.status(201).send({ message: 'User updated' })
    }).catch((error) => {
        res.status(400).send(error)
    })
}

export const saveVerificationRequest: RequestHandler = (req, res) => {
    const idToken = req.headers.authorization?.split(' ')[1]

    if (idToken) {
        auth.verifyIdToken(idToken)
        .then((decodedIdToken) => {
            const newRequest: VerificationRequest = {
                uid: decodedIdToken.uid,
                user: {
                    emailVerified: decodedIdToken.email_verified == true,
                    email: decodedIdToken.email,
                    photoURL: decodedIdToken.picture
                },
                text: req.body.text
            }
            database.setVerificationRequest(newRequest)
            .then((requestID) => {
                res.status(201).send({message: 'Saved request with ID: ' + requestID})
            }).catch((error) => {
                res.status(500).send(error)
            })
        })
    } else {
        res.status(400).send({ message: 'IdToken not found on request' })
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
                res.status(200).send({ message: 'User deleted successfuly' })
            })
            .catch((error) => {
                res.status(500).send(error)
            });
        })
        .catch((error) => {
            res.status(401).send(error)
        });
    } else {
        res.status(400).send({ message: 'IdToken not found on request' })
    }
}
