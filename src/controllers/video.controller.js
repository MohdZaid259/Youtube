import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose";
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

  const video = await videoService.findVideoById(videoId)

  if(!video){
    throw new ApiError(404,"video not found!")
  }

  const isDeleted = await videoService.deleteVideoById(videoId)

  if(!isDeleted){
    throw new ApiError(401,"video couldn't be deleted!")
  }

  await videoService.deleteVideoFile(video.videoFile)
  await videoService.deleteThumbnail(video.thumbnail)

  await videoService.deleteLikes(videoId)
  await videoService.deleteComments(videoId)

  return res.status(201).json(
    new ApiResponse(201,{},'video deleted successfully!')
  )
})

const updateVideo = asyncHandler( async(req,res) => {
  const { videoId } = req.params
  const { title,description,isPublished } = req.body
  const thumbnailLocalPath = req.file?.path

  const video = await videoService.findVideoById(videoId)
  
  if(!video){
    throw new ApiError(404,"Video not found!")
  }
  
  const thumbnail = await videoService.uploadThumbnail(thumbnailLocalPath)
  await videoService.deleteThumbnail(video.thumbnail)
  
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

  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid user ID", 400);
  }

  const pipeline = [];

  if (userId) {
    pipeline.push({ $match: { owner: new mongoose.Types.ObjectId(userId) } });
  }

  const queryOptions = "i";

  if (query) {
    pipeline.push({
      $match: {
        title: {
          $regex: query,
          options: queryOptions,
        },
      },
    });
  }

  pipeline.push({
    $match: {
      owner: new mongoose.Types.ObjectId(userId),
      isPublished: true,
    },
  });

  if (sortBy && sortType) {
    pipeline.push({
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    });
  } else {
    pipeline.push({
      $sort: {
        createdAt: -1,
      },
    });
  }

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "ownerDetails",
      pipeline: [
        {
          $project: {
            username: 1,
            "avatar.url": 1,
          },
        },
      ],
    },
  });

  pipeline.push({
    $unwind: {
      path: "$ownerDetails",
      preserveNullAndEmptyArrays: true,
    },
  });

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const video = await Video.aggregatePaginate(
    Video.aggregate(pipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, video, "All videos fetched successfully"));
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