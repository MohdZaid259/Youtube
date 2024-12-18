import { Comment } from "../models/comment.model.js"

const createComment = async(commentData) => {
  return await Comment.create(commentData)
}

const findCommentById = async(commentId) => {
  return await Comment.findById(commentId)
}

const editComment = async(commentId,editData) => {
  return await Comment.findByIdAndUpdate(commentId,editData,{new:true})
}

const deleteComment = async(commentId) =>{
  await Comment.findByIdAndDelete(commentId)
}

export default {createComment, editComment, deleteComment, findCommentById}