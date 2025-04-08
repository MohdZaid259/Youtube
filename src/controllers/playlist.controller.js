import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import playlistService from '../services/playlist.service.js'
import { Playlist } from '../models/playlist.model.js'

const createPlaylist = asyncHandler( async(req,res) => {
  const {name,description} = req.body

  const playlist = await playlistService.create({
    name,
    description,
    owner:req.user?._id
  })

  const createdPlaylist = await playlistService.findById(playlist._id)

  if(!createdPlaylist){
    new ApiError(500,"Couldn't create playlist!");
  }

  return res.status(200).json(
    new ApiResponse(200,createdPlaylist,'Playlist created successfully!')
  )
})

const addToPlaylist = asyncHandler( async(req,res) => {
  const {videoId} = req.params
  const {playlistId} = req.body
  
  const playlist = await playlistService.findById(playlistId)

  if(!playlist){
    throw new ApiError(404,'Playlist not found!')
  }

  if(playlist.owner.toString() !== req.user?._id.toString()){
    throw new ApiError(401,'Unauthorized request!')
  }

  const updatedPlaylist = await playlistService.findByIdAndUpdate(
    playlistId,
    {
      $push: { videos: videoId}
    }
  )

  if(!updatedPlaylist){
    throw new ApiError(500,"Couldn't add video to playlist!");
  }

  return res.status(200).json(
    new ApiResponse(200,updatedPlaylist,'Video added to playlist!')
  )
})

const removeFromPlaylist = asyncHandler( async(req,res) => {
  const {videoId} = req.params
  const {playlistId} = req.body

  const playlist = await playlistService.findById(playlistId)

  if(!playlist){
    throw new ApiError(404,'Playlist not found!')
  }

  if(playlist.owner.toString() !== req.user?._id.toString()){
    throw new ApiError(401,'Unauthorized request!')
  }

  const updatedPlaylist = await playlistService.findByIdAndUpdate(
    playlistId,
    {
      $pull: {videos:videoId} // what if pop?
    }
  )

  if(!updatedPlaylist){
    throw new ApiError(500,"Couldn't remove video from playlist!");
  }
  
  return res.status(200).json(
    new ApiResponse(200,updatedPlaylist,"Video removed from playlist!")
  )
})

const deletePlaylist = asyncHandler( async(req,res) => {
  const {playlistId} = req.params

  const playlist = await playlistService.findById(playlistId)

  if(!playlist){
    new ApiError(401,'Playlist not found!')
  }

  const deletedPlaylist = await playlistService.findByIdAndDelete(playlistId)

  if(!deletedPlaylist){
    new ApiError(500,'Playlist couldnt be deleted!')
  }
  
  return res.status(200).json(
    new ApiResponse(200,{},'Playlist deleted successfully!')
  )
})

const updatePlaylist = asyncHandler( async(req,res) => {
  const {playlistId,name,description} = req.body

  const playlist = await playlistService.findById(playlistId)

  if(!playlist){
    throw new ApiError(404,'Playlist not found!')
  }

  if(playlist.owner.toString() !== req.user?._id.toString()){
    throw new ApiError(401,'Unauthorized request!')
  }

  const updatedPlaylist = await playlistService.findByIdAndUpdate(
    playlistId,
    {
      $set:{
        name,
        description
      }
    },
    { runValidators: true }
  )

  if(!updatedPlaylist){
    throw new ApiError(500,"Couldn't add video to playlist!");
  }

  return res.status(200).json(
    new ApiResponse(200,updatedPlaylist,'Video added to playlist!')
  )
})

const getPlaylist = asyncHandler( async(req,res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid userId");
  }

  const playlists = await Playlist.aggregate([
      {
          $match: {
              owner: new mongoose.Types.ObjectId(userId)
          }
      },
      {
          $lookup: {
              from: "videos",
              localField: "videos",
              foreignField: "_id",
              as: "videos"
          }
      },
      {
          $addFields: {
              totalVideos: {
                  $size: "$videos"
              },
              totalViews: {
                  $sum: "$videos.views"
              }
          }
      },
      {
          $project: {
              _id: 1,
              name: 1,
              description: 1,
              totalVideos: 1,
              totalViews: 1,
              updatedAt: 1
          }
      }
  ]);

  return res
  .status(200)
  .json(new ApiResponse(200, playlists, "User playlists fetched successfully"));

})

export {addToPlaylist, removeFromPlaylist, createPlaylist, deletePlaylist, updatePlaylist, getPlaylist}