import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import validation from '../middlewares/validation.middleware.js'
import { createPlaylist,deletePlaylist } from '../controllers/playlist.controller.js'

const playlistRouter = Router()

playlistRouter.use(verifyJWT)

playlistRouter.route('/').post(validation.videoId, validation.playlistData, createPlaylist)
playlistRouter.route('/:playlistId').delete(validation.playlistId, deletePlaylist)

export default playlistRouter