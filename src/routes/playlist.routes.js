/**
 * @swagger
 * tags:
 *   name: Playlists
 *   description: API endpoints for managing playlists.
 */

import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import validation from '../middlewares/validation.middleware.js'
import { createPlaylist,deletePlaylist,addToPlaylist,removeFromPlaylist,updatePlaylist } from '../controllers/playlist.controller.js'

const playlistRouter = Router()

playlistRouter.use(verifyJWT)

/**
 * @swagger
 * /playlists:
 *   post:
 *     summary: Create a new playlist.
 *     tags: [Playlists]
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
 *       400:
 *         description: Invalid data or missing fields.
 */
playlistRouter.route('/').post(validation.videoId, validation.playlistData, createPlaylist)

/**
 * @swagger
 * /playlists/{playlistId}:
 *   delete:
 *     summary: Delete a playlist.
 *     tags: [Playlists]
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
 * /playlists/{playlistId}/add-video/{videoId}:
 *   patch:
 *     summary: Add a video to a playlist.
 *     tags: [Playlists]
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
 *       400:
 *         description: Invalid playlist ID or video ID.
 *   patch:
 *     summary: Remove a video from a playlist.
 *     tags: [Playlists]
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
 *   patch:
 *     summary: Update playlist details.
 *     tags: [Playlists]
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
 *       400:
 *         description: Invalid playlist ID or data.
 */
playlistRouter.route('/:videoId').patch(validation.playlistId, validation.videoId, addToPlaylist)
                                .patch(validation.playlistId, validation.videoId, removeFromPlaylist)
                                .patch(validation.playlistId, validation.playlistData, updatePlaylist)

export default playlistRouter