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
        })
    } else {
        res.status(400).send({ message: 'IdToken not found on request' })
    }
}