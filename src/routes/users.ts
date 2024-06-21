import express from 'express'
import multer from 'multer'
import { deleteUser, signUp, updateData } from '../controllers/userController'

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
 *               photo:
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
 * /users/updateData:
 *   put:
 *     summary: Update user data
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               displayName:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
user_router.put('/updateData', upload.single('photo'), updateData)

/**
 * @openapi
 * /users/deleteUser:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Bad request. IdToken not found on request
 *       401:
 *         description: Unauthorized. Invalid IdToken
 *       500:
 *         description: Internal server error
 */
user_router.delete('/', deleteUser)

export default user_router