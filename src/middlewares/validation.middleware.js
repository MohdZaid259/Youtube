import { isValidObjectId } from 'mongoose' 
import {ApiError} from '../utils/ApiError.js'

const registerUser = (req,_,next) => {
  const {fullname, username, password, email} = req.body

  if( //if any of them is true, all true
    [fullname, username, password, email].some((item)=> item === undefined || item.trim() === '')
  ){
    throw new ApiError(400,'All fields are required!')
  }
  next()
}

const loginUser = (req,_,next) => {
  const {username,email,password} = req.body

  if(!password || password.trim() === ''){
    throw new ApiError(400,'Password is required!')
  }
  if (!username && !email) {
    throw new ApiError(400, 'Either username or email is required!');
  }

  next()
}

const updateUser = (req,_,next) => {
  const {fullname,email} = req.body

  if(!fullname && !email){
    throw new ApiError(401,'Nothing to update with!')
  }
  next()
}

const updateUserImages = (imageType) => {
  return (req,_,next) => {
    const imagePath = req.file?.path
    
    if(!imagePath){
      throw new ApiError(400,`${imageType} not found!`)
    }
    next()
  }
}

const videoData = (req,_,next) => {
  const { title,description } = req.body

  if(
    [title,description].some((item)=>item.trim()==='')
  ){
    throw new ApiError(400,'All fields are required!')
  }
  next()
}

const userId = (req,_,next) => {
  const { userId } = req.params

  if(!isValidObjectId(userId)){
    throw new ApiError(401,"Invalid userId!")
  }
  next()
}

const videoId = (req,_,next) => {
  const { videoId } = req.params

  if(!isValidObjectId(videoId)){
    throw new ApiError(401,"Invalid videoId!")
  }
  next()
}

const videoFile = (req,_,next) => {
  const videoFileLocalPath = req.files?.videoFile[0]?.path

  if(!videoFileLocalPath){
    throw new ApiError(400,'Video not found!')
  }
  next()
}

const thumbnail = (req,_,next) => {
  const thumbnailLocalPath = req.file?.path

  if(!thumbnailLocalPath){
    throw new ApiError(400,'Thumbnail not found!')
  }
  next()
}

const commentId = (req,_,next) => {
  const {commentId} = req.params

  if(!isValidObjectId(commentId)){
    throw new ApiError(401,'Invalid commentId!')
  }
  next()
}

const commentContent = (req,_,next) => {
  const {content} = req.body

  if(content.trim()===''){
    throw new ApiError(401,'No content in comment!')
  }
  next()
}

const playlistId = (req,_,next) => {
  const {playlistId} = req.params

  if(!isValidObjectId(playlistId)){
    throw new ApiError(401,'Invalid playlistId!')
  }
  next()
}

const playlistData = (req,_,next) => {
  const {name,description} = req.body

  if([name,description].some(item=>item.trim==='')){
    throw new ApiError(400,'All fields are required!')
  }
  next()
}

const channelId = (req,_,next) => {
  const {channelId} = req.params
  
  if(!isValidObjectId(channelId)){
    throw new ApiError(401,'Invalid channelId!')
  }
  next()
}

const replyId = (req,_,next) => {
  const {replyId} = req.params
  
  if(!isValidObjectId(replyId)){
    throw new ApiError(401,'Invalid replyId!')
  }
  next()
}

export default { registerUser, loginUser, updateUser, updateUserImages, videoData, userId, videoId, videoFile, thumbnail, commentId, commentContent, playlistId, playlistData, channelId, replyId }