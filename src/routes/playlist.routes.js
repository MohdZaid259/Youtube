/**
 * @swagger
 * tags:
 *   name: Playlist
 *   description: API endpoints for playlist management
 */

import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import validation from '../middlewares/validation.middleware.js'
import { createPlaylist,deletePlaylist,addToPlaylist,removeFromPlaylist,updatePlaylist,getPlaylist } from '../controllers/playlist.controller.js'

const playlistRouter = Router()

playlistRouter.use(verifyJWT)

/**
 * @swagger
 * /playlist:
 *   post:
 *     summary: Create a new playlist.
 *     tags: [Playlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoId:
 *                 type: string
 *                 description: ID of the video to include in the playlist.
 *               playlistData:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the playlist.
 *                   description:
 *                     type: string
 *                     description: Description of the playlist.
 *     responses:
 *       201:
 *         description: Playlist successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Invalid data or missing fields.
 */
playlistRouter.route('/').post(validation.videoId, validation.playlistData, createPlaylist)

/**
 * @swagger
 * /playlist/{playlistId}:
 *   delete:
 *     summary: Delete a playlist.
 *     tags: [Playlist]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the playlist to delete.
 *     responses:
 *       200:
 *         description: Playlist successfully deleted.
 *       400:
 *         description: Invalid playlist ID.
 */
playlistRouter.route('/:playlistId').delete(validation.playlistId, deletePlaylist)

/**
 * @swagger
 * /playlist/add/{videoId}:
 *   patch:
 *     summary: Add a video to a playlist.
 *     tags: [Playlist]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the playlist to update.
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the video to add to the playlist.
 *     responses:
 *       200:
 *         description: Video successfully added to the playlist.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Invalid playlist ID or video ID.
 */
playlistRouter.route('/add/:videoId').patch(validation.playlistId, validation.videoId, addToPlaylist)

/**
 * @swagger
 * /playlist/remove/{videoId}:
 *   patch:
 *     summary: Remove a video from a playlist.
 *     tags: [Playlist]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the playlist to update.
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the video to remove from the playlist.
 *     responses:
 *       200:
 *         description: Video successfully removed from the playlist.
 *       400:
 *         description: Invalid playlist ID or video ID.
*/
playlistRouter.route('/remove/:videoId').patch(validation.playlistId, validation.videoId, removeFromPlaylist)

/**
 * @swagger
 * /playlist:
 *   patch:
 *     summary: Update playlist details.
 *     tags: [Playlist]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the playlist to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the playlist.
 *               description:
 *                 type: string
 *                 description: Updated description of the playlist.
 *     responses:
 *       200:
 *         description: Playlist successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Invalid playlist ID or data.
 */
playlistRouter.route('/:videoId').patch(validation.playlistId, validation.playlistData, updatePlaylist)

/**
 * @swagger
 * /playlist:
 *   get:
 *     summary: get playlist details.
 *     tags: [Playlist]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the playlist to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the playlist.
 *               description:
 *                 type: string
 *                 description: Updated description of the playlist.
 *     responses:
 *       200:
 *         description: Playlist successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Invalid playlist ID or data.
 */
playlistRouter.route('/user/:userId').get(validation.userId, getPlaylist)

export default playlistRouter