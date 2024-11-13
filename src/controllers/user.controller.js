import { asyncHandler } from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId) // 'user' is of MongoDB, 'User' is of mongoose

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken,refreshToken}
  } catch (err) {
    throw new ApiError(500,'Something went wrong while generating tokens!')
  }
}

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

  const createdUser = await User.findById(user?._id).select("-password -refreshToken")

  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registration!")
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, 'User Registered Successfully!')
  )
})

const loginUser = asyncHandler( async (req,res) => {
  // get user details
  // validate username | email
  // find user
  // compare password
  // generate access-refresh tokens
  // set cookies
  // return response

  const {username,email,password} = req.body

  if(!username && !email){ // validation on password needed?
    throw new ApiError(400,'Username or email is required!')
  }

  const user = User.findOne({
    $or:[{username},{email}]
  })

  if(!user){
    throw new ApiError(400,"User doesn't exist!")  
  }

  const isPasswordValid = await user.isPasswordCorrect(password) // await bcz of db connection?

  if(!isPasswordValid){
    throw new ApiError(400,"Invalid User Credentials!")  
  }

  const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly:true,
    secure: true
  }
  return res.status(200)
            .cookie('accessToken',accessToken,options)
            .cookie('refreshToken',refreshToken,options)
            .json(
              new ApiResponse(201,{
                  user:loggedInUser,
                  accessToken,
                  refreshToken
                },"User logged In successfully!"
              )
            )
})

const logoutUser = asyncHandler( async (req,res) => {
  // get user from database - auth.middleware
  // remove refreshToken
  // clear cookies

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{ // check with unset
        refreshToken:null // why undefined not works here
      }
    },
    { new:true }
  )

  const options = {
    httpOnly:true,
    secure:true
  }
  return res.status(200)
            .clearCookie('accessToken')
            .clearCookie('refreshToken')
            .json(
              new ApiResponse(200,{},'User logged out!')
            )
})

const refreshAccessToken = asyncHandler( async (req,res) => {
  // get refreshToken
  // decode it
  // get user
  // compare it with user's refreshToken
  // generate new tokens
  // set cookie with new tokens

  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401,'Unauthorized request!')
  }

  const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

  const user = await User.findById(decodedToken?._id)

  if(!user){
    throw new ApiError(401,'Invalid refresh token')
  }

  if(incomingRefreshToken !== user?.refreshToken){
    throw new ApiError(401,'Refresh token is expired')
  }

  const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id)

  const options={
    httpOnly:true,
    secure:true
  }

  return res.status(200)
            .cookie('accessToken',accessToken,options)
            .cookie('refreshToken',newRefreshToken,options)
            .json(
              new ApiResponse(200,
                {accessToken, refreshToken:newRefreshToken},
                'AccessToken refreshed successfully!'
              )
            )
})

const changePassword = asyncHandler( async (req,res) => {  
  const {oldPassword,newPassword} = req.body
  
  const user = await User.findById(req.user?._id)

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400,'Unauthorized request!')
  }

  user.password = newPassword
  await user.save({validateBeforeSave:false})

  return res.status(200)
            .json(
              new ApiResponse(200,{},'password updated!')
            )
})

const currentUser = asyncHandler( async (req,res) => {
  return res.status(200).json(
    new ApiResponse(200,req.user,'current user fetched successfully!')
  )
})

const updateAccount = asyncHandler( async (req,res) => {
  const {fullname,email} = req.body

  if(!fullname && !email){
    throw new ApiError(401,'Nothing to update with!')
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: req.body // updates only whose value present
    },
    {new:true, runValidators:true}
  ).select('-password -refreshToken')

  return res.status(200)
            .json(
              new ApiResponse(200,user,'Account updated!')
            )
})

const updateAvatar = asyncHandler( async (req,res) => {
  const avatarLocalPath = req.file?.path

  if(!avatarLocalPath){
    throw new ApiError(400,'Avatar not found!')
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if(!avatar){
    throw new ApiError(400,'Avatar upload failed!')
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar:avatar.url
      }
    },
    {new:true}
  ).select('-password -refreshToken')
// delete previous image
  return res.status(200)
            .json(
              new ApiResponse(200,user,'Avatar updated successfully!')
            )
})

const updateCoverImage = asyncHandler( async (req,res) => {
  const coverImageLocalPath = req.file?.path

  if(!coverImageLocalPath){
    throw new ApiError(400,'coverImage not found!')
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!coverImage){
    throw new ApiError(400,'coverImage upload failed!')
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage:coverImage.url
      }
    },
    {new:true}
  ).select('-password -refreshToken')
// delete previous image
  return res.status(200)
            .json(
              new ApiResponse(200,user,'Cover Image updated successfully!')
            )
})

const getChannelProfile = asyncHandler( async (req,res) => {
  const {username} = req.params

  if(!username?.trim()){
    throw new ApiError(400,'username is missing!')
  }

  const channel = await User.aggregate([ // check what's in channel 
    {
      $match:{
        username:username.toLowerCase()
      }
    },{
      $lookup:{
        from:'subscriptions',
        localField:'_id',
        foreignField:'channel',
        as:'subscribers'
      }
    },{
      $lookup:{
        from:'subscriptions',
        localField:'_id',
        foreignField:'subscriber',
        as:'subscribedTo'
      }
    },{
      $addFields:{
        subscribersCount:{
          $size:'$subscribers'
        },
        subscribedToCount:{
          $size:'$subscribedTo'
        },
        isSubscribed:{
          $cond:{
            if: {$in: [req.user?._id,'$subscribers.subscriber']},
            then: true,
            else: false
          }
        }
      }
    },{
      $project:{
        fullname:1,
        username:1,
        email:1,
        avatar:1,
        coverImage:1,
        subscribersCount:1,
        subscribedToCount:1,
        isSubscribed:1
      }
    }
  ])

  if(!channel?.length){
    throw new ApiError(400,"channel doesn't exist!")
  }

  return res.status(200).json(
    new ApiResponse(200,channel[0],'channel fetched successfully!')
  )
})

const getWatchHistory = asyncHandler ( async(req,res) => {
  const user = await User.aggregate([ // check what's in user
    {
      $match:{
        _id: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup:{
        from:'videos',
        localField:'watchHistory',
        foreignField:'_id',
        as:'watchHistory',
        pipeline:[{
          $lookup:{
            from:'users',
            localField:'owner',
            foreignField:'_id',
            as:'owner',
            pipeline:[{ // do alter method
              $project:{
                fullname:1,
                username:1,
                avatar:1
              }
            }]
          }
        }]
      }
    }
  ])

  return res.status(200).json(
    new ApiResponse(200,user,'watchHistory fetched!')
  )
})

export {registerUser, loginUser, logoutUser, refreshAccessToken, changePassword, currentUser, updateAccount, updateAvatar, updateCoverImage, getChannelProfile, getWatchHistory}