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

const videoService = {createVideo, findVideoById, updateVideoById,deleteVideoById}

export default videoService