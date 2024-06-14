import express from 'express'
import multer from 'multer'
import { deleteUser, saveVerificationRequest, signUp, updateData } from '../controllers/userController'

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
 * /users/verification:
 *   post:
 *     summary: Guardar solicitud de verificación
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Texto de la solicitud de verificación
 *             required:
 *               - text
 *     responses:
 *       '201':
 *         description: Solicitud de verificación guardada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación.
 *       '400':
 *         description: Solicitud incorrecta. Se requiere un identificador de usuario.
 *       '401':
 *         description: No autorizado. Token de autorización inválido o no proporcionado.
 *       '500':
 *         description: Error interno del servidor.
 */
user_router.post('/verification', express.json(), saveVerificationRequest)

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