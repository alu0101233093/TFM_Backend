import express from 'express'
import multer from 'multer'
import { signUp, updateProfilePic, updateUser } from '../controllers/userController'

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
user_router.post('/signUp', upload.single('photo'), signUp)

/**
 * @openapi
 * /users/updateProfilePic:
 *   post:
 *     summary: Update user profile picture
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
user_router.post('/updateProfilePic', upload.single('photo'), updateProfilePic)

/**
 * @openapi
 * /users/updateUserData:
 *   post:
 *     summary: Update user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
user_router.post('/updateUserData', express.urlencoded({ extended: true }), updateUser)

export default user_router