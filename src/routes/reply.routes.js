/**
 * @swagger
 * tags:
 *   name: Reply
 *   description: API endpoints for replies management.
 */

import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import validation from "../middlewares/validation.middleware.js";
import { addReply, deleteReply, editReply } from "../controllers/reply.controller.js";

const replyRouter = Router()

replyRouter.use(verifyJWT)

/**
 * @swagger
 * /reply/{commentId}:
 *   post:
 *     summary: Add a reply to a comment
 *     tags: [Reply]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to reply to.
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reply'
 *       400:
 *         description: Bad request
 */
replyRouter.route('/:commentId').post(validation.commentId, addReply)

/**
 * @swagger
 * /reply/{replyId}:
 *   delete:
 *     summary: Delete a reply.
 *     tags: [Reply]
 *     parameters:
 *       - in: path
 *         name: replyId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the reply to delete.
 *     responses:
 *       200:
 *         description: Reply successfully deleted.
 *       400:
 *         description: Invalid reply ID.
 *   patch:
 *     summary: Edit a reply.
 *     tags: [Reply]
 *     parameters:
 *       - in: path
 *         name: replyId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the reply to edit.
 *       - in: body
 *         name: content
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *         required: true
 *         description: New content for the reply.
 *     responses:
 *       200:
 *         description: Reply successfully updated.
 *       400:
 *         description: Invalid reply ID or missing data.
 */
replyRouter.route('/:replyId').delete(validation.replyId, deleteReply)
                              .patch(validation.replyId, validation.commentContent, editReply)

export default replyRouter