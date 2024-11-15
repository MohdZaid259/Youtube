import { Router } from "express";
import { addComment, deleteComment, editComment } from "../controllers/comment.controller";
import { verifyJWT } from '../middlewares/auth.middleware'

const commentRouter = Router()

commentRouter.use(verifyJWT)

commentRouter.route('/:videoId').post(addComment)
commentRouter.route('/channel/:commentId').patch(editComment).delete(deleteComment)

export default commentRouter