import { Video } from "../models/video.model";

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

const deleteVideoFiles = async(videoFile,thumbnail) => {
  const isVideoDeleted = await deleteFromCloudinary(videoFile)
  const isThumbnailDeleted = await deleteFromCloudinary(thumbnail)
  
  return [isVideoDeleted,isThumbnailDeleted]
}

export default videoService = {createVideo, findVideoById, updateVideoById, deleteVideoById, uploadVideoFile, uploadThumbnail, deleteVideoFiles}