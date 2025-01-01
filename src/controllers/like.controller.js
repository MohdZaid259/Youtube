import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import likeService from "../services/like.service.js";
import { Like } from "../models/like.model.js";

const toggleVideoLike = asyncHandler( async(req,res) => {
  const {videoId} = req.params

  const alreadyLiked = await likeService.findOne({ // log it
    video:videoId,
    owner:req.user?._id
  })

  if(alreadyLiked){
    await likeService.findByIdAndDelete(alreadyLiked._id)

    return res.status(200).json(
      new ApiResponse(200,{},'Like removed from video!')
    )
  }

  const likeVideo = await likeService.create({
    video:videoId,
    owner:req.user?._id
  })

  if(!likeVideo){
    throw new ApiError(500,"Couldn't like video!")
  }

  return res.status(200).json(
    new ApiResponse(200,likeVideo,'video liked!')
  )
})

const toggleCommentLike = asyncHandler( async(req,res) => {
  const {commentId} = req.params

  const alreadyLiked = await likeService.findOne({
    comment:commentId,
    owner:req.user?._id
  })

  if(alreadyLiked){
    await likeService.findByIdAndDelete(alreadyLiked._id)

    return res.status(200).json(
      new ApiResponse(200,{},'Like removed from comment!')
    )
  }

  const likeComment = await likeService.create({
    comment:commentId,
    owner:req.user?._id
  })

  if(!likeComment){
    throw new ApiError(500,"Couldn't like comment!")
  }

  return res.status(200).json(
    new ApiResponse(200,likeComment,'comment liked!')
  )
})

const toggleReplyLike = asyncHandler( async(req,res) => {
  const {replyId} = req.params

  const alreadyLiked = await likeService.findOne({
    reply:replyId,
    owner:req.user?._id
  })

  if(alreadyLiked){
    await likeService.findByIdAndDelete(alreadyLiked._id)

    return res.status(200).json(
      new ApiResponse(200,{},'Like removed from reply!')
    )
  }

  const likedReply = await likeService.create({
    reply:replyId,
    owner:req.user?._id
  })

  if(!likedReply){
    throw new ApiError(500,"Couldn't like reply!")
  }

  return res.status(200).json(
    new ApiResponse(200,likedReply,'reply liked!')
  )
})

const getLikedVideos = asyncHandler( async(req,res) => {

  const videos = await Like.aggregate([
    {
      $match:{
        owner: req.user?._id
      }
    },
    {
      $group:{
        _id:'$owner',
        videos:{
          $push:'$video'
        }
      }
    }
  ])

  return res.status(200).json(
    new ApiResponse(200,videos,'LikedVideos fetched Successfully!')
  )
})

export {toggleVideoLike, toggleCommentLike, toggleReplyLike, getLikedVideos}