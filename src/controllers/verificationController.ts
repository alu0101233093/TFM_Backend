import { RequestHandler } from "express";
import { ADMIN_UID } from "../consts";
import { VerificationRequest } from "../models/verificationRequest";
import { CustomError } from "../models/customError";
import { auth, database } from "../app";

export const saveVerificationRequest: RequestHandler = (req, res) => {
    if(!req.body.text){
        return res.status(400).send(new CustomError('Bad request. Text request required.'))
    }
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

export const getRequests: RequestHandler = (req, res) => {
    const idToken = req.headers.authorization?.split(' ')[1]

    if (idToken) {
        auth.verifyIdToken(idToken)
        .then((decodedIdToken) => {
            if(decodedIdToken.uid != ADMIN_UID) {
                return res.status(403).send(new CustomError('User logged is not an administrator.'))
            } else {
                database.getVerificationRequests().then((requests: VerificationRequest[]) => {
                    return res.status(200).send(requests)
                }).catch((error) => {
                    return res.status(400).send(error)
                })
            }
        }).catch((error) => {
            return res.status(401).send(error)
        })
    } else {
        return res.status(400).send(new CustomError('IdToken not found on request'))
    }
}

export const updateRequestStatus: RequestHandler = (req, res) => {
    const idToken = req.headers.authorization?.split(' ')[1]

    if (idToken) {
        auth.verifyIdToken(idToken)
        .then((decodedIdToken) => {
            if(decodedIdToken.uid != ADMIN_UID) {
                return res.status(401).send(new CustomError('User logged is not an administrator.'))
            } else {
                const requestID = req.body.requestID
                const newStatus = req.body.newStatus
                if(!requestID || !newStatus){
                    return res.status(400).send(new CustomError('Bad request. RequestID or newStatus not provided.'))
                }
                database.updateRequestStatus(requestID, newStatus)
                .then((uid) => {
                    const newRol = newStatus == 'Approved'
                    auth.changeUserRole(uid, newRol).then(() => {
                        return res.status(200).send({message: 'User role changed successfully'})
                    }).catch((error) => {
                        return res.status(500).send(error)
                    })
                }).catch((error) => {
                    return res.status(400).send(error)
                })
            }
        }).catch((error) => {
            return res.status(401).send(error)
        })
    } else {
        return res.status(400).send(new CustomError('IdToken not found on request'))
    }
}