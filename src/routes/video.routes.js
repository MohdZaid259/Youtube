import { Router } from 'express'
import { deleteVideo, updateVideo, uploadVideo } from '../controllers/video.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

const videoRouter = Router()

videoRouter.use(verifyJWT) // as all the routes needs authentication inhere

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
  uploadVideo
)
videoRouter.route('/:videoId').delete(deleteVideo)
videoRouter.route('/:videoId').patch(upload.single('thumbnail'),updateVideo)

export default videoRouter