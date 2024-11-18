import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import playlistService from '../services/playlist.service.js'

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
  
})

const removeFromPlaylist = asyncHandler( async(req,res) => {

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

})

export {addToPlaylist, removeFromPlaylist, createPlaylist, deletePlaylist, updatePlaylist}