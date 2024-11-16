import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose";
import { uploadOnCloudinary,deleteFromCloudinary } from "../utils/cloudinary.js";
import videoService from '../services/video.service.js'

const uploadVideo = asyncHandler( async(req,res) => {
  // get video details
  // validation - not empty
  // check for video, thumbnail
  // upload on cloudinary
  // create video object entry in db
  // return response

  const {title, description, views, isPublished} = req.body

  const videoFileLocalPath = req.files?.videoFile[0]?.path
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path

  const videoFile = await videoService.uploadVideoFile(videoFileLocalPath)
  const thumbnail = await videoService.uploadThumbnail(thumbnailLocalPath)

  if(!videoFile){
    throw new ApiError(400,'Something went wrong while uploading video!')
  }

  const videoData = {
    videoFile:videoFile.url,
    thumbnail:thumbnail.url,
    title,
    description,
    duration:videoFile.duration,
    views,
    isPublished,
    owner:req.user?._id
  }

  const video = await videoService.createVideo(videoData)

  const createdVideo = await videoService.findVideoById(video?._id)

  if(!createdVideo){
    throw new ApiError(400,'Something went wrong while uploading video!')
  }

  return res.status(201).json(
      new ApiResponse(201, createdVideo, 'Video Uploaded Successfully!')
  )
})

const deleteVideo = asyncHandler( async(req,res) => {
  // fetch video
  // check if there's a video to delete
  // delete it
  // delete from cloundStorage
  // return response

  const { videoId } = req.params

  if(!isValidObjectId(videoId)){
    throw new ApiError(401,"Invalid videoId!")
  }

  const video = await videoService.findVideoById(videoId)

  if(!video){
    throw new ApiError(404,"video not found!")
  }

  const isDeleted = await videoService.deleteVideoById(videoId)

  if(!isDeleted){
    throw new ApiError(401,"video couldn't be deleted!")
  }

  const isFilesDeleted = await videoService.deleteVideoFiles(video.videoFile,video.thumbnail)

  if(isFilesDeleted.some((item)=>item===false)){
    throw new ApiError(401,"Video files couldn't be deleted!")
  }

  return res.status(201).json(
    new ApiResponse(201,{},'video deleted successfully!')
  )
})

const updateVideo = asyncHandler( async(req,res) => {
  const { videoId } = req.params
  const { title,description,isPublished } = req.body
  const thumbnailLocalPath = req.file?.path

  const thumbnail = await videoService.uploadThumbnail(thumbnailLocalPath)
  // delete old thumbnail
  const video = await videoService.findVideoById(videoId)

  if(!video){
    throw new ApiError(404,"Video not found!")
  }

  const updatedVideo = await videoService.updateVideoById(
    videoId,
    {
      $set:{
        title,
        description,
        thumbnail:thumbnail.url,
        isPublished
      }
    }
  )

  if(!updatedVideo){
    throw new ApiError(400,"Video couldn't be updated")
  }

  return res.status(200).json(
    new ApiResponse(200,updatedVideo,'Video updated successfully!')
  )
})

const getVideoDetails = asyncHandler( async(req,res) => {
  const { videoId } = req.params

  if(!isValidObjectId(videoId)){
    throw new ApiError(401,"Invalid videoId!")
  }

  const video = await videoService.findVideoById(videoId)

  if(!video){
    throw new ApiError(404,'Video not found!')
  }

  return res.status(201).json(
    new ApiResponse(201, video, 'video fetched successfully!')
  )
})

const getAllVideos = asyncHandler( async(req,res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
  // based on query, sort, pagination (req.query)
})

const togglePublish = asyncHandler( async(req,res) => {
  const { videoId } = req.params

  if(!isValidObjectId(videoId)){
    throw new ApiError(401,"Invalid videoId!")
  }

  const video = await videoService.findVideoById(videoId)

  if(!video){
    throw new ApiError(404,"Video not found!")
  }

  const toggleStatus = await videoService.updateVideoById(
    videoId,
    {
      $set:{
        isPublished:!video.isPublished
      }
    }
  )

  if(!toggleStatus){
    throw new ApiError(404,"Couldn't toggle!")
  }

  res.status(200).json(
    new ApiResponse(200,toggleStatus,'Toggle done!')
  )
})

export {uploadVideo, deleteVideo, updateVideo, getVideoDetails, getAllVideos, togglePublish}