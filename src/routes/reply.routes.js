import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import validation from "../middlewares/validation.middleware.js";
import { addReply, deleteReply, editReply } from "../controllers/reply.controller.js";

const replyRouter = Router()

replyRouter.use(verifyJWT)

replyRouter.route('/:commentId').post(validation.commentId, addReply)
replyRouter.route('/:replyId').delete(validation.replyId, deleteReply)
                              .patch(validation.replyId, validation.commentContent, editReply)

export default replyRouter