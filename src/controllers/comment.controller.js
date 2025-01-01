import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import commentService from "../services/comment.service.js";
import videoService from '../services/video.service.js';
import { Video } from "../models/video.model.js"

const getComments = asyncHandler( async(req,res) => {
  const {videoId} = req.params

  const comments = await Video.aggregate([
    {
      $match:{
        _id: new mongoose.Types.ObjectId(videoId)
      }
    },
    {
      $lookup:{
        from:'comments',
        localField:'comments',
        foreignField:'_id',
        as:'comments'
      }
    },
    {
      $unwind: "$comments"
    },
    {
      $project:{
        _id:0,
        comments:{
          content:"$comments.content",
          owner:"$comments.owner"
        }
      }
    }
  ])

  return res.status(200).json(
    new ApiResponse(200,comments,'Comment Fetched!')
  )
})

const addComment = asyncHandler( async(req,res) => {
  const {content} = req.body
  const {videoId} = req.params

  const video = await videoService.findVideoById(videoId)

  if(!video){
    throw new ApiError(404,'Video not found!')
  }

  const commentData = {
    content,
    video:videoId,
    owner:req.user?._id
  }

  const createdComment = await commentService.createComment(commentData)

  if(!createdComment){
    throw new ApiError(501, "Comment couldn't be added!");
  }

  video.comments.push(createdComment?._id)
  await video.save()

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
  
  if(!(req.user?._id.toString()===comment.owner.toString())){
    return new ApiError(401,'Unauthorized request!')
  }

  const editedComment = await commentService.editComment(
    commentId,
    {
      $set:{
        content
      }
    }
  )

  if(!editedComment){
    throw new ApiError(501,"Comment couldn't be updated!");
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

  if(!(req.user?._id.toString()===comment.owner.toString())){
    return new ApiError(401,'Unauthorized request!')
  }

  const isDeleted = await commentService.deleteComment(commentId)

  if(!isDeleted){
    throw new ApiError(401,{},"Comment couldn't be deleted!")
  }
  
  await commentService.deleteLikes(commentId)

  res.status(201).json(
    new ApiResponse(201,{},'Comment deleted successfully!')
  )
})

export {getComments, addComment, editComment, deleteComment}