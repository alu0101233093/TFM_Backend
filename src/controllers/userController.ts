import { RequestHandler, Response } from "express"
import { FB_IMAGE_DEFAULT } from '../services/FirebaseStr'
import { UserFirebaseAuth } from '../models/user/userFirebaseAuth'
import { VerificationRequest } from "../models/verificationRequest"
import { CustomError } from "../models/customError"
import { auth, database, storage } from "../app"

export const signUp: RequestHandler = (req, res) => {
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
            return res.status(400).send(error)
        })
    }).catch((error) => {
        return res.status(400).send(error)
    })
}

export const updateData: RequestHandler = (req, res) => {
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
                    updateUser(decodedIdToken.uid, user_request, res)
                }).catch((error) => {
                    return res.status(500).send(error)
                })
            } else {
                updateUser(decodedIdToken.uid, user_request, res)
            }
        }).catch((error) => {
            return res.status(401).send(error)
        })
    } else {
        return res.status(400).send(new CustomError('IdToken not found on request'))
    }
}

const updateUser = async (uid: string, user: UserFirebaseAuth, res: Response) => {
    return auth.updateUser(uid, user)
    .then((_user_record) => {
        return res.status(201).send({message: 'User updated'})
    }).catch((error) => {
        return res.status(400).send(new CustomError('Error saving user information.', error))
    })
}

export const saveVerificationRequest: RequestHandler = (req, res) => {
    const idToken = req.headers.authorization?.split(' ')[1]

    if (idToken) {
        auth.verifyIdToken(idToken)
        .then((decodedIdToken) => {
            const newRequest: VerificationRequest = {
                uid: decodedIdToken.uid,
                status: 'Pending',
                user: {
                    emailVerified: decodedIdToken.email_verified ?? false,
                    email: decodedIdToken.email || '',
                    photoURL: decodedIdToken.picture || ''
                },
                text: req.body.text
            }
            database.setVerificationRequest(newRequest)
            .then((requestID) => {
                return res.status(201).send({message: 'Saved request with ID: ' + requestID})
            }).catch((error) => {
                return res.status(500).send(error)
            })
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
