import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import validation from '../middlewares/validation.middleware.js'
import { toggleCommentLike, toggleVideoLike } from "../controllers/like.controller.js";

const likeRouter = Router()

likeRouter.use(verifyJWT)

likeRouter.route('/toggle/video/:videoId').post(validation.videoId, toggleVideoLike)
likeRouter.route('/toggle/comment/:commentId').post(validation.commentId, toggleCommentLike)

export default likeRouter