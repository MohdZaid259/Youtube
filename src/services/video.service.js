import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary,deleteFromCloudinary } from '../utils/cloudinary.js'

const createVideo = async(videoData) => {
  return await Video.create(videoData)
}

const findVideoById = async(videoId) => {
  return await Video.findById(videoId)
}

const updateVideoById = async(videoId,updateData) => {
  return await Video.findByIdAndUpdate(videoId,updateData,{new:true})
}

const deleteVideoById = async(videoId) => {
  return await Video.findByIdAndDelete(videoId)
}

const uploadVideoFile = async(videoFileLocalPath) =>{
  return await uploadOnCloudinary(videoFileLocalPath)
}

const uploadThumbnail = async(thumbnailLocalPath) =>{
  return await uploadOnCloudinary(thumbnailLocalPath)
}

const deleteVideoFile = async(videoUrl) => {
  return await deleteFromCloudinary(videoUrl)
}

const deleteThumbnail = async(thumbnailUrl) => {
  return await deleteFromCloudinary(thumbnailUrl)
}

const deleteLikes = async(videoId) => {
  return await Like.deleteMany({video:videoId})
}

const deleteComments = async(videoId) => {
  return await Comment.deleteMany({video:videoId})
}

export default {createVideo, findVideoById, updateVideoById, deleteVideoById, uploadVideoFile, uploadThumbnail, deleteVideoFile, deleteThumbnail, deleteLikes, deleteComments}