import { asyncHandler } from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/apiResponse.js'
import { User } from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'

const registerUser = asyncHandler( async (req,res) => {
  // get user details
  // validation - not empty
  // check if already exists 
  // check for avatar, coverImage
  // upload on cloudinary
  // create user object entry in db
  // remove password and refreshToken from response
  // check if user created
  // return response 
  
  const {fullname, username, password, email} = req.body

  if( // validation extraction
    [fullname, username, password, email].some((item)=>item.trim()==='')
  ){
    throw new ApiError(400,'All fields are required!')
  }

  const existedUser = await User.findOne({ // what if find
    $or: [{username},{email}]
  })

  if(existedUser){
    throw new ApiError(400,'User with this username or email already exists!')
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverImageLocalPath = req.files?.coverImage[0]?.path || null
  
  if(!avatarLocalPath){
    throw new ApiError(400,'Avatar is required!')
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar){
    throw new ApiError(400,"Something went wrong while uploading avatar!")
  }

  const user = await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || '',
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registration!")
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, 'User Registered Successfully!')
  )
})

export {registerUser}