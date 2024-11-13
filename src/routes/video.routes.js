import { Router } from 'express'
import { deleteVideo, getVideoDetails, updateVideo, uploadVideo } from '../controllers/video.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
import { videoValidator } from '../middlewares/videoValidator.middleware.js'

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
videoRouter.route('/:videoId')
          .delete(deleteVideo)
          .patch(upload.single('thumbnail'),videoValidator,updateVideo)
          .get(getVideoDetails)

export default videoRouter