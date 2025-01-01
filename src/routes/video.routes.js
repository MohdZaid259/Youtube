import { Router } from 'express'
import { deleteVideo, getVideoDetails, updateVideo, uploadVideo, togglePublish } from '../controllers/video.controller.js'
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
          .patch(upload.single('thumbnail'),validation.thumbnail,validation.videoId, updateVideo)
          .get(validation.videoId,getVideoDetails)
          
videoRouter.route('/toggle/:videoId').patch(validation.videoId,togglePublish)

export default videoRouter