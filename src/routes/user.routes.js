/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints for users management.
 */

import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changePassword, currentUser, updateAccount, updateAvatar, updateCoverImage, updateWatchHistory, getChannelProfile, getWatchHistory } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import validation from  '../middlewares/validation.middleware.js'

const userRouter = Router()

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *     security: [] 
 */
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
  validation.registerUser,
  registerUser
)

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *     security: [] 
 */
userRouter.route('/login').post(validation.loginUser,loginUser)

//secured routes

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
userRouter.route('/logout').post(verifyJWT, logoutUser)

/**
 * @swagger
 * /user/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       400:
 *         description: Bad request
 */
userRouter.route('/refresh-token').post(refreshAccessToken)

/**
 * @swagger
 * /user/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request
 */
userRouter.route('/change-password').post(verifyJWT, changePassword)

/**
 * @swagger
 * /user/current-user:
 *   get:
 *     summary: Get current user details
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Current user details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
userRouter.route('/current-user').get(verifyJWT, currentUser)

/**
 * @swagger
 * /user/update-account:
 *   patch:
 *     summary: Update user account details
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
userRouter.route('/update-account').patch(verifyJWT, validation.updateUser, updateAccount)

/**
 * @swagger
 * /user/update-avatar:
 *   patch:
 *     summary: Update user avatar
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *       400:
 *         description: Bad request
 */
userRouter.route('/update-avatar').patch(verifyJWT, upload.single('avatar'), validation.updateUserImages('avatar'), updateAvatar)

/**
 * @swagger
 * /user/update-cover-image:
 *   patch:
 *     summary: Update user cover image
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cover image updated successfully
 *       400:
 *         description: Bad request
 */
userRouter.route('/update-coverImage').patch(verifyJWT, upload.single('coverImage'), validation.updateUserImages('coverImage'), updateCoverImage)

/**
 * @swagger
 * /user/update-watch-history:
 *   patch:
 *     summary: Update user watch history
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Watch history updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
userRouter.route('/update-watchHistory/:videoId').patch(verifyJWT,validation.videoId,updateWatchHistory)

/**
 * @swagger
 * /user/channel-profile/{userId}:
 *   get:
 *     summary: Get channel profile
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Channel profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
userRouter.route('/channel/:username').get(verifyJWT, getChannelProfile)

/**
 * @swagger
 * /user/watch-history:
 *   get:
 *     summary: Get user watch history
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Watch history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
userRouter.route('/history').get(verifyJWT, getWatchHistory)

export default userRouter