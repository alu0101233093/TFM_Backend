import express from 'express'
import multer from 'multer'
import { FirebaseAuth } from '../classes/FirebaseAuth'
// import { FirebaseRTDB } from '../classes/FirebaseRTDB'
import { FirebaseStr } from '../classes/FirebaseStr'
import { user_firebase_auth } from '../entities/user_firebase_auth'
// import { firebaseApp } from '..'
// import * as authapp from 'firebase/auth'
// import { logInUser } from '../entities/logInUser'

const auth = new FirebaseAuth
// const db = new FirebaseRTDB
const storage = new FirebaseStr

const user_router = express.Router()
const upload = multer({
    storage: multer.memoryStorage()
});

user_router.post('/signup', upload.single('photoURL'), (req, res) => {
    let user_request: user_firebase_auth = {
        ...req.body,
        profile_pic: '',
        emailVerified: req.body.emailVerified === 'true'
    }

    auth.createUser(user_request)
    .then((user_record) => {
        storage.savePicture(req.file, user_record.uid)
        .then((image_url) => {
            user_request.photoURL = image_url
            auth.updateUser(user_record.uid, user_request)
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

user_router.post('/updateProfilePic', upload.single('photoURL'), (req, res) => {

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
})

user_router.post('/updateData', express.urlencoded(), (req, res) => {
    let user_request: user_firebase_auth = {
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
})

// /// TEMPORAL PARA TESTEAR
// user_router.post('/getjwt', express.urlencoded(), (req, res) => {
//     console.log(req.body)
//     const user: logInUser = req.body
    
//     const auth = authapp.getAuth(firebaseApp)
//     authapp.signInWithEmailAndPassword(auth, user.username, user.password)
//     .then((user_credentials) => {
//         user_credentials.user.getIdToken().then((jwt) => {
//             res.status(200).send(jwt)
//         })
//     }).catch((error) => {
//         res.status(500).send(error.message)
//     })
// })

// /// TEMPORAL PARA TESTEAR
// user_router.post('/getuser', express.urlencoded(), (req, res) => {
//     console.log(req.body)
//     const user: logInUser = req.body
    
//     const auth = authapp.getAuth(firebaseApp)
//     authapp.signInWithEmailAndPassword(auth, user.username, user.password)
//     .then((user_credentials) => {
//         res.status(200).send(user_credentials.user)
//     }).catch((error) => {
//         res.status(500).send(error.message)
//     })
// })

/// PARA FRONTEND
// user_router.post('/login', express.urlencoded(), (req, res) => {
//     console.log(req.body)
//     const user: logInUser = req.body
    
//     db.getEmailByUsername(user.username)
//     .then((email) => {
//         auth.logIn(email, user.password)
//         .then((user_credential) => {
//             user_credential.user.getIdToken().then((jwt) => {
//                 res.status(200).json({ jwt, message: 'User logged in successfully' })
//             }).catch((error) => {
//                 res.status(500).send(error.message)
//             })
//         }).catch((error) => {
//             res.status(401).send(error.message)
//         })
//     }).catch((error) => {
//         res.status(404).send(error.message)
//     })
// })

export default user_router