/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: API endpoints for managing likes on videos, comments, and replies, and fetching liked videos.
 */

import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import validation from '../middlewares/validation.middleware.js'
import { toggleCommentLike, toggleVideoLike, toggleReplyLike, getLikedVideos } from "../controllers/like.controller.js";

const likeRouter = Router()

likeRouter.use(verifyJWT)

/**
 * @swagger
 * /likes/{videoId}:
 *   post:
 *     summary: Toggle like for a video.
 *     tags: [Likes]
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
likeRouter.route('/:videoId').post(validation.videoId, toggleVideoLike)

/**
 * @swagger
 * /likes/{commentId}:
 *   post:
 *     summary: Toggle like for a comment.
 *     tags: [Likes]
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
likeRouter.route('/:commentId').post(validation.commentId, toggleCommentLike)

/**
 * @swagger
 * /likes/{replyId}:
 *   post:
 *     summary: Toggle like for a reply.
 *     tags: [Likes]
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
likeRouter.route('/:replyId').post(validation.replyId, toggleReplyLike)

/**
 * @swagger
 * /likes/likedVideos:
 *   get:
 *     summary: Get a list of liked videos.
 *     tags: [Likes]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of liked videos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   videoId:
 *                     type: string
 *                     description: ID of the liked video.
 *                   title:
 *                     type: string
 *                     description: Title of the liked video.
 *                   likedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the video was liked.
 */
likeRouter.route('/likedVideos').get(getLikedVideos)

export default likeRouter