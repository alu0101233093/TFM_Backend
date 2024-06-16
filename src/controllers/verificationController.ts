import { RequestHandler } from "express";
import { FirebaseAuth } from "../services/FirebaseAuth";
import { ADMIN_UID } from "../consts";
import { FirebaseRTDB } from "../services/FirebaseRTDB";
import { VerificationRequest } from "../entities/verificationRequest";

const auth = new FirebaseAuth
const database = new FirebaseRTDB

export const getRequests: RequestHandler = (req, res) => {
    const idToken = req.headers.authorization?.split(' ')[1]

    if (idToken) {
        auth.verifyIdToken(idToken)
        .then((decodedIdToken) => {
            if(decodedIdToken.uid != ADMIN_UID) {
                return res.status(401).send()
            } else {
                database.getVerificationRequests().then((requests: VerificationRequest[]) => {
                    res.status(200).send(requests)
                }).catch((error) => {
                    res.status(400).send(error)
                })
            }
        }).catch((error) => {
            res.status(401).send(error)
        })
    } else {
        res.status(400).send({ message: 'IdToken not found on request' })
    }
}

export const updateRequest: RequestHandler = (req, res) => {
    const idToken = req.headers.authorization?.split(' ')[1]

    if (idToken) {
        auth.verifyIdToken(idToken)
        .then((decodedIdToken) => {
            if(decodedIdToken.uid != ADMIN_UID) {
                return res.status(401).send()
            } else {
                const requestID = req.body.requestID
                const newStatus = req.body.newStatus
                if(!requestID || !newStatus){
                    res.status(400).send('Bad request. RequestID or newStatus not provided.')
                }
                database.updateVerificationRequestStatus(requestID, newStatus)
                .then((message) => {
                    res.status(200).send({message})
                }).catch((error) => {
                    res.status(400).send(error)
                })
            }
        })
    } else {
        res.status(400).send({ message: 'IdToken not found on request' })
    }
}