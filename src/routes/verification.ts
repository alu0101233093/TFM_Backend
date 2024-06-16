import express from 'express'
import { getRequests } from '../controllers/verificationController'

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
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
verification_router.get('/', getRequests)

export default verification_router