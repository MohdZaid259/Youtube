import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from '../models/video.model.js'

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
    videoFile,
    thumbnail,
    title,
    description,
    // duration
    // views
    // isPublished
    // owner
  })

  return res.status(201).json(
    new ApiResponse(201,video,'Video Uploaded Successfully!')
  )
})

const deleteVideo = asyncHandler( async(req,res) => {

})

const updateVideo = asyncHandler( async(req,res) => {
  // (req.params)
})

const searchVideo = asyncHandler( async(req,res) => {

})

const getVideoById = asyncHandler( async(req,res) => {
  // (req.params)
})

const getAllVideos = asyncHandler( async(req,res) => {
  // based on query, sort, pagination (req.query)
})

const getTrendingVideos = asyncHandler( async(req,res) => {

})

const togglePublish = asyncHandler( async(req,res) => {

})

export {uploadVideo, deleteVideo, updateVideo, searchVideo, getVideoById, getAllVideos, getTrendingVideos, togglePublish}