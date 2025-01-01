import { Router } from "express";
import { getComments, addComment, deleteComment, editComment } from "../controllers/comment.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import validation from '../middlewares/validation.middleware.js'

const commentRouter = Router()

commentRouter.use(verifyJWT)

commentRouter.route('/:videoId')
            .post(validation.commentContent, addComment)
            .get(validation.videoId, getComments)
commentRouter.route('/c/:commentId')
              .patch(validation.commentContent, validation.commentId, editComment)
              .delete(validation.commentId, deleteComment)

export default commentRouter