import { Comment } from "../models/comment.model.js"
import { Like } from "../models/like.model.js"

const createComment = async(commentData) => {
  return await Comment.create(commentData)
}

const findCommentById = async(commentId) => {
  return await Comment.findById(commentId)
}

const editComment = async(commentId,editData) => {
  return await Comment.findByIdAndUpdate(commentId,editData,{new:true})
}

const deleteComment = async(commentId) => {
  return await Comment.findByIdAndDelete(commentId)
}

const deleteLikes = async(commentId) => {
  return await Like.deleteMany({comment:commentId})
}

export default {createComment, editComment, deleteComment, findCommentById, deleteLikes}