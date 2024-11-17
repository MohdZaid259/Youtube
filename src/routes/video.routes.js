import { Router } from 'express'
import { deleteVideo, getVideoDetails, updateVideo, uploadVideo } from '../controllers/video.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
import validation from '../middlewares/validation.middleware.js'

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
  validation.videoData,
  validation.videoFile,
  uploadVideo
)
videoRouter.route('/:videoId')
          .delete(validation.videoId,deleteVideo)
          .patch(upload.single('thumbnail'),validation.videoData,validation.videoId,validation.videoFile, updateVideo)
          .get(validation.videoId,getVideoDetails)

export default videoRouter