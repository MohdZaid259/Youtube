/**
 * @swagger
 * tags:
 *   name: Like
 *   description: API endpoints for managing likes on videos, comments and replies.
 */

import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import validation from '../middlewares/validation.middleware.js'
import { toggleCommentLike, toggleVideoLike, toggleReplyLike, getLikedVideos } from "../controllers/like.controller.js";

const likeRouter = Router()

likeRouter.use(verifyJWT)

/*-*
 * @swagger
 * /like/v/{videoId}:
 *   post:
 *     summary: Toggle like for a video.
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the video to toggle the like for.
 *     responses:
 *       200:
 *         description: Successfully toggled the like status for the video.
 *       400:
 *         description: Invalid video ID.
 */
likeRouter.route('v/:videoId').post(validation.videoId, toggleVideoLike)

/**
 * @swagger
 * /like/c/{commentId}:
 *   post:
 *     summary: Toggle like for a comment.
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to toggle the like for.
 *     responses:
 *       200:
 *         description: Successfully toggled the like status for the comment.
 *       400:
 *         description: Invalid comment ID.
 */
likeRouter.route('c/:commentId').post(validation.commentId, toggleCommentLike)

/**
 * @swagger
 * /like/r/{replyId}:
 *   post:
 *     summary: Toggle like for a reply.
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: replyId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the reply to toggle the like for.
 *     responses:
 *       200:
 *         description: Successfully toggled the like status for the reply.
 *       400:
 *         description: Invalid reply ID.
 */
likeRouter.route('r/:replyId').post(validation.replyId, toggleReplyLike)

/**
 * @swagger
 * /like/likedVideos:
 *   get:
 *     summary: Get a list of liked videos.
 *     tags: [Like]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of liked videos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Like'
 */
likeRouter.route('/likedVideos').get(getLikedVideos)

export default likeRouter