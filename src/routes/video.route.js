import { Router } from 'express'
import { uploadVideo } from '../controllers/video.controller.js'

const videoRouter = Router()

videoRouter.route('/upload-video').post(uploadVideo)

export default videoRouter