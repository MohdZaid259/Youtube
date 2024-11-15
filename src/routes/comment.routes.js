import { Router } from "express";
import { addComment, deleteComment, editComment } from "../controllers/comment.controller";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { commentContentValidation,commentIdValidation } from '../middlewares/validation.middleware.js'
const commentRouter = Router()

commentRouter.use(verifyJWT)

commentRouter.route('/:videoId').post(commentContentValidation,commentIdValidation,addComment)
commentRouter.route('/channel/:commentId').patch(commentContentValidation,commentIdValidation,editComment).delete(commentIdValidation,deleteComment)

export default commentRouter