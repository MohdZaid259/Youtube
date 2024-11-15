import { isValidObjectId } from 'mongoose' 

const videoValidator = (req,_,next) => {
  const { videoId } = req.params
  const { title,description } = req.body

  if(
    [title,description].some((item)=>item.trim()==='')
  ){
    throw new ApiError(400,'All fields are required!')
  }

  if(!isValidObjectId(videoId)){
    throw new ApiError(401,"Invalid videoId!")
  }

  const thumbnailLocalPath = req.file?.path

  if(!thumbnailLocalPath){
    throw new ApiError(400,'Thumbnail not found!')
  }
  
  next()
}

export { videoValidator }