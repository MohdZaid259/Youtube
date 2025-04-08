/**
 * @swagger
 * tags:
 *   name: Video
 *   description: API endpoints for videos management.
 */

import { Router } from 'express'
import { deleteVideo, getVideoDetails, getAllVideos, updateVideo, uploadVideo, togglePublish } from '../controllers/video.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
import validation from '../middlewares/validation.middleware.js'

const videoRouter = Router()

/**
 * @swagger
 * /video/upload-video:
 *   post:
 *     summary: Upload a new video
 *     tags: [Video]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               videoFile:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 *       400:
 *         description: Bad request
 */
videoRouter.route('/upload-video').post(
  upload.fields([
    {
      name:'videoFile',
      maxCount:1
    },{
      name:'thumbnail',
      maxCount:1
    }
  ]),
  verifyJWT,
  validation.videoData,
  validation.videoFile,
  uploadVideo
)

/**
 * @swagger
 * /video/{videoId}:
 *   delete:
 *     summary: Delete a video
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *       400:
 *         description: Bad request
 *   patch:
 *     summary: Update a video
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 *       400:
 *         description: Bad request
 */
videoRouter.route('/:videoId')
          .delete(verifyJWT,validation.videoId,deleteVideo)
          .patch(verifyJWT,upload.single('thumbnail'),validation.thumbnail,validation.videoId, updateVideo)

/**
 * @swagger
 * /video/{videoId}:
 *   get:
 *     summary: Get video details
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 *       400:
 *         description: Bad request
 */
videoRouter.route('/:videoId').get(validation.videoId,getVideoDetails)
          
/**
 * @swagger
 * /video/toggle/{videoId}:
 *   patch:
 *     summary: Toggle video publish status
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video publish status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 *       400:
 *         description: Bad request
 */
videoRouter.route('/toggle/:videoId').patch(verifyJWT,validation.videoId,togglePublish)

/**
 * @swagger
 * /video:
 *   get:
 *     summary: Get all the videos
 *     tags: [Video]
 *     responses:
 *       200:
 *         description: List of all videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 *       400:
 *         description: Bad request
 *     security: [] 
 */
videoRouter.route('/').get(getAllVideos)

export default videoRouter