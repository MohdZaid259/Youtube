import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import likeService from "../services/like.service";
import { Like } from "../models/like.model";

const toggleVideoLike = asyncHandler( async(req,res) => {
  const {videoId} = req.params

  const alreadyLiked = await likeService.findOne({ // log it
    video:videoId,
    likedBy:req.user?._id
  })

  if(alreadyLiked){
    await likeService.findByIdAndDelete(alreadyLiked._id)

    return res.status(200).json(
      new ApiResponse(200,{},'Like removed from video!')
    )
  }

  const likeVideo = await likeService.create({
    video:videoId,
    likedBy:req.user?._id
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
    likedBy:req.user?._id
  })

  if(alreadyLiked){
    await likeService.findByIdAndDelete(alreadyLiked._id)

    return res.status(200).json(
      new ApiResponse(200,{},'Like removed from comment!')
    )
  }

  const likeComment = await likeService.create({
    comment:commentId,
    likedBy:req.user?._id
  })

  if(!likeComment){
    throw new ApiError(500,"Couldn't like comment!")
  }

  return res.status(200).json(
    new ApiResponse(200,likeComment,'comment liked!')
  )
})

const getLikedVideos = asyncHandler( async(req,res) => {

})

export {toggleVideoLike, toggleCommentLike, getLikedVideos}