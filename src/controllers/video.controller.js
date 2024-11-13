import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from '../models/video.model.js'
import { isValidObjectId } from "mongoose";
import { uploadOnCloudinary,deleteFromCloudinary } from "../utils/cloudinary.js";

const uploadVideo = asyncHandler( async(req,res) => {
  // get video details
  // validation - not empty
  // check for video, thumbnail
  // upload on cloudinary
  // create video object entry in db
  // return response

  const {title, description, views, isPublished} = req.body

  if(
    [title,description].some((item)=>item.trim()==='')
  ){
    throw new ApiError(400,'All fields are required!')
  }

  const videoFileLocalPath = req.files?.videoFile[0]?.path
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path

  if(!videoFileLocalPath || !thumbnailLocalPath){
    throw new ApiError(400,'VideoFile & thumbnail are required!')
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath)
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

  if(!videoFile || !thumbnail){
    throw new ApiError(400,'Something went wrong while uploading avatar!')
  }

  const video = await Video.create({
    videoFile:videoFile.url,
    thumbnail:thumbnail.url,
    title,
    description,
    duration:videoFile.duration,
    views,
    isPublished,
    owner:req.user?._id
  })

  const createdVideo = await Video.findById(video?._id)

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

  const video = await Video.findById(videoId)

  if(!video){
    throw new ApiError(404,"video not found!")
  }

  const isDeleted = await Video.findByIdAndDelete(videoId)

  if(!isDeleted){
    throw new ApiError(401,"video couldn't be deleted!")
  }

  await deleteFromCloudinary(video.videoFile)
  await deleteFromCloudinary(video.thumbnail)

  return res.status(201).json(
    new ApiResponse(201,'video deleted successfully!')
  )
})

const updateVideo = asyncHandler( async(req,res) => {
  const { videoId } = req.params
  const { title,description,isPublished } = req.body
  const thumbnailLocalPath = req.file?.path

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
// delete old thumbnail
  const video = await Video.findById(videoId)

  if(!isValidObjectId(video)){
    throw new ApiError(404,"Video not found!")
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set:{
        title,
        description,
        thumbnail:thumbnail.url,
        isPublished
      }
    },
    {new:true}
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

  const video = await Video.findById(videoId)

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

  const video = await Video.findById(videoId)

  if(!video){
    throw new ApiError(404,"Video not found!")
  }

  const toggleStatus = await Video.findByIdAndUpdate(
    videoId,
    {
      $set:{
        isPublished:!video.isPublished
      }
    },
    {new:true}
  )

  if(!toggleStatus){
    throw new ApiError(404,"Couldn't toggle!")
  }

  res.status(200).json(
    new ApiResponse(200,toggleStatus,'Toggle done!')
  )
})

export {uploadVideo, deleteVideo, updateVideo, getVideoDetails, getAllVideos, togglePublish}