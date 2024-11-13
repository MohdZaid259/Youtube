import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changePassword, currentUser, updateAccount, updateAvatar, updateCoverImage, getChannelProfile, getWatchHistory } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const userRouter = Router()

userRouter.route('/register').post(
  upload.fields([
    {
      name:'avatar',
      maxCount:1
    },{
      name:'coverImage',
      maxCount:1
    }
  ]),
  registerUser
)
userRouter.route('/login').post(loginUser)

//secured routes
userRouter.route('/logout').post(verifyJWT,logoutUser)
userRouter.route('/refresh-token').post(refreshAccessToken)
userRouter.route('/change-password').post(verifyJWT,changePassword)
userRouter.route('/current-user').get(verifyJWT,currentUser)
userRouter.route('/update-account').patch(verifyJWT,updateAccount)
userRouter.route('/update-avatar').patch(verifyJWT,upload.single('avatar'),updateAvatar)
userRouter.route('/update-coverImage').patch(verifyJWT,upload.single('coverImage'),updateCoverImage)
userRouter.route('/channel/:username').get(verifyJWT,getChannelProfile)
userRouter.route('/history').get(verifyJWT,getWatchHistory)

export default userRouter