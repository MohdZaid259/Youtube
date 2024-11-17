import { isValidObjectId } from 'mongoose' 

const registerUser = (req,_,next) => {
  const {fullname, username, password, email} = req.body

  if(
    [fullname, username, password, email].some((item)=>item.trim()==='')
  ){
    throw new ApiError(400,'All fields are required!')
  }

  next()
}

const loginUser= (req,_,next) => {
  const {username,email,password} = req.body

  if(
    [username, email, password].some((item)=>item.trim()==='')
  ){
    throw new ApiError(400,'All fields are required!')
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

const videoId = (req,_,next) => {
  const { videoId } = req.params

  if(!isValidObjectId(videoId)){
    throw new ApiError(401,"Invalid videoId!")
  }

  next()
}

const videoFile = (req,_,next) => {
  const thumbnailLocalPath = req.file?.path

  if(!thumbnailLocalPath){
    throw new ApiError(400,'Thumbnail not found!')
  }

  next()
}

const commentId = (req,res,next) => {
  const {commentId} = req.params

  if(!isValidObjectId(commentId)){
    throw new ApiError(401,'Invalid commentId!')
  }

  next()
}

const commentContent = (req,res,next) => {
  const {content} = req.body

  if(content.trim()===''){
    throw new ApiError(401,'No content in comment!')
  }

  next()
}

export default { registerUser, loginUser, updateUser, updateUserImages, videoData, videoId, videoFile, commentId, commentContent }