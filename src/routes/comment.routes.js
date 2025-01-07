/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: API endpoints for managing comments on videos.
 */

import { Router } from "express";
import { getComments, addComment, deleteComment, editComment } from "../controllers/comment.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import validation from '../middlewares/validation.middleware.js'

const commentRouter = Router()

commentRouter.use(verifyJWT)

/**
 * @swagger
 * /comment/{videoId}:
 *   post:
 *     summary: Add a new comment to a video.
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the video to add a comment to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Content of the comment.
 *     responses:
 *       201:
 *         description: Comment successfully added.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid video ID or comment content.
 *   get:
 *     summary: Get all comments for a video.
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the video to fetch comments for.
 *     responses:
 *       200:
 *         description: List of comments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid video ID.
 */
commentRouter.route('/:videoId')
            .post(validation.commentContent, addComment)
            .get(validation.videoId, getComments)

/**
 * @swagger
 * /comment/c/{commentId}:
 *   patch:
 *     summary: Edit an existing comment.
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to edit.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated content of the comment.
 *     responses:
 *       200:
 *         description: Comment successfully updated.
 *       400:
 *         description: Invalid comment ID or content.
 *   delete:
 *     summary: Delete a comment.
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to delete.
 *     responses:
 *       200:
 *         description: Comment successfully deleted.
 *       400:
 *         description: Invalid comment ID.
 */
commentRouter.route('/c/:commentId')
              .patch(validation.commentContent, validation.commentId, editComment)
              .delete(validation.commentId, deleteComment)

export default commentRouter