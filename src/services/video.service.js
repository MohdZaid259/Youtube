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

export default {createVideo, findVideoById, updateVideoById, deleteVideoById, uploadVideoFile, uploadThumbnail, deleteVideoFile, deleteThumbnail}