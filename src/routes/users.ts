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


/**
 * @openapi
 * /users/signup:
 *   post:
 *     summary: Signup a new user
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               displayName:
 *                 type: string
 *               emailVerified:
 *                 type: boolean
 *               photoURL:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User signed up successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
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
})

/**
 * @openapi
 * /users/updateProfilePic:
 *   post:
 *     summary: Update user profile picture
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photoURL:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User data updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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

/**
 * @openapi
 * /users/updateData:
 *   post:
 *     summary: Update user data
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               displayName:
 *                 type: string
 *               emailVerified:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User data updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
user_router.post('/updateData', express.urlencoded({ extended: true }), (req, res) => {
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