import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import commentService from "../services/comment.service";
import { isValidObjectId } from "mongoose";

const getComment = asyncHandler( async(req,res) => {

})

const addComment = asyncHandler( async(req,res) => {
  const {content} = req.body
  const {videoId} = req.params

  const commentData = {
    content,
    video:videoId,
    owner:req.user?._Id
  }

  const createdComment = await commentService.createComment(commentData)

  if(!createdComment){
    throw new ApiError(501, "Comment couldn't be added!");
  }

  return res.status(201).json(
    new ApiResponse(201,createdComment,'comment added!')
  )
})

const editComment = asyncHandler( async(req,res) => {
  const {content} = req.body
  const {commentId} = req.params

  const comment = await commentService.findCommentById(commentId)

  if(!comment){
    throw new ApiError(404,'Comment not found!')
  }
  // only commentOwner can edit thier comments

  const editedComment = await commentService.editComment(
    commentId,
    {
      $set:{
        content
      }
    }
  )

  if(!editedComment){
    throw new ApiError(501, "Comment couldn't be updated!");
  }
    
  return res.status(201).json(
    new ApiResponse(201,editedComment,'comment added!')
  )
})

const deleteComment = asyncHandler( async(req,res) => {
  const {commentId} = req.params

  const comment = await commentService.findCommentById(commentId)

  if(!comment){
    throw new ApiError(404,'Comment not found!')
  }
  // only commentOwner can delete thier comments
  
  const isDeleted = await commentService.deleteComment(commentId)

  if(!isDeleted){
    throw new ApiError(401,{},"Comment couldn't be deleted!")
  }
  // delete the commentLikes also

  res.status(201).json(
    new ApiResponse(201,{},'Comment deleted successfully!')
  )
})

export {getComment,addComment,editComment,deleteComment}