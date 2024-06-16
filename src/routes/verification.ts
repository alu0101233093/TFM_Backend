import express from 'express'
import { getRequests, updateRequest } from '../controllers/verificationController'

const verification_router = express.Router()

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
verification_router.patch('/', express.json(), updateRequest)

export default verification_router