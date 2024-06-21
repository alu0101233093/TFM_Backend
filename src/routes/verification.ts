import express from 'express'
import { getRequests, saveVerificationRequest, updateRequestStatus } from '../controllers/verificationController'

const verification_router = express.Router()

/**
 * @openapi
 * /verification:
 *   post:
 *     summary: Guardar solicitud de verificación
 *     tags: [Verification]
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
verification_router.post('/', express.json(), saveVerificationRequest)

/**
 * @openapi
 * /verification:
 *   get:
 *     summary: Get verification requests from users
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   requestID:
 *                     type: string
 *                   uid:
 *                     type: string
 *                   status:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                       emailVerified:
 *                         type: boolean
 *                       photoURL:
 *                         type: string
 *                   text:
 *                     type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
verification_router.get('/', getRequests)

/**
 * @openapi
 * /verification:
 *   patch:
 *     summary: Update the status of a verification request
 *     tags: [Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestID:
 *                 type: string
 *                 description: The ID of the verification request to update
 *               newStatus:
 *                 type: string
 *                 description: The new status for the verification request
 *     responses:
 *       200:
 *         description: Request status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
verification_router.patch('/', express.json(), updateRequestStatus)

export default verification_router