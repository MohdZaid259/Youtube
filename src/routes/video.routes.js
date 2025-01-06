/**
 * @swagger
 * tags:
 *   name: Video
 *   description: API endpoints for video management.
 */

import { Router } from 'express'
import { deleteVideo, getVideoDetails, updateVideo, uploadVideo, togglePublish } from '../controllers/video.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
import validation from '../middlewares/validation.middleware.js'

const videoRouter = Router()

videoRouter.use(verifyJWT)

/**
 * @swagger
 * /upload-video:
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
 *       400:
 *         description: Bad request
 */
videoRouter.route('/upload-video').post(
  upload.fields([
    {
      name:'videoFile',
      maxCount:1
    },
    {
      name:'thumbnail',
      maxCount:1
    }
  ]),
  validation.videoData,
  validation.videoFile,
  uploadVideo
)

/**
 * @swagger
 * /{videoId}:
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
 *       400:
 *         description: Bad request
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
 *       400:
 *         description: Bad request
 */
videoRouter.route('/:videoId')
          .delete(validation.videoId,deleteVideo)
          .patch(upload.single('thumbnail'),validation.thumbnail,validation.videoId, updateVideo)
          .get(validation.videoId,getVideoDetails)
          
/**
 * @swagger
 * /toggle/{videoId}:
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
 *       400:
 *         description: Bad request
 */
videoRouter.route('/toggle/:videoId').patch(validation.videoId,togglePublish)

export default videoRouter