import { Playlist } from '../models/playlist.model.js'

const create = async(data) => {
  return await Playlist.create(data) 
}

const findById = async(playlistId) => {
  return await Playlist.findById(playlistId)
}

const findByIdAndUpdate = async(playlistId,playlistData,options=[]) => {
  return await Playlist.findByIdAndUpdate(playlistId,playlistData,{new:true,...options})
}

const findByIdAndDelete = async(playlistId) => {
  return await Playlist.findByIdAndDelete(playlistId)
}

export default {create, findById, findByIdAndUpdate, findByIdAndDelete}