import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import jsonwebtoken from 'jsonwebtoken'

const generateTokens = async(userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave:false })

    return { accessToken,refreshToken }

  } catch (error) {
    throw new ApiError(500,"Couldn't generate tokens!!")
  }
}

const registerUser = asyncHandler( async (req,res) => {
  //get the details from frontend
  //validation-not empty
  //check if user already exists-username,email
  //ckeck for images & avatar
  //upload them to cloudinary
  //create user object-create entry in db
  //remove password & refresh token field form response
  //check for user creation
  //return response

  const {fullname,email,username,password} = req.body
  console.log(req.body)
  console.log('email',email);

  if( [fullname,email,username,password].some((field)=>field?.trim()==='') ){
    throw new ApiError(400,'All fields are required !!') //use map for once
  }

  const existedUser = await User.findOne({
    $or:[{ username },{ email }]
  })
  if(existedUser){
    throw new ApiError(409,'Email & Username already exists')
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  // const coverImageLocalPath = req.files?.coverImage[0]?.path
  console.log(req.files)

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImageLocalPath=req.files.coverImage[0].path
  }

  if(!avatarLocalPath){
    throw new ApiError(400,'Avatar is required!!')
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar){
    throw new ApiError(500,"couldn't sent to cloud!!")
  }

  const user = await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || '',
    email,
    password,
    username:username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select('-password -refreshToken')
  if(!createdUser){
    throw new ApiError(500,'server failed while registering')
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,'User Registered Successfully!!')
  )

})

const loginUser = asyncHandler( async (req,res) => {
// get the detail from frontend
// logging with username or email
// validation-email,password
// isEmpty?
// check credentials from server 
// generate accesstoken & refreshtoken
// send cookies
// return response

  const {email,username,password} = req.body

  if(!(username || email) ){
    throw new ApiError(400,'username or email is required!!')
  }

  const user = await User.findOne({
    $or: [{username},{email}]
  })
  if(!user){
    throw new ApiError(400,'User not found')
  }

  const isPasswordValid = await user.isPasswordCorrect(password)
  if(!isPasswordValid){
    throw new ApiError(400,'Invalid user credentials')
  }

  const {accessToken,refreshToken} = await generateTokens(user._id)

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

  const options = {
    httpOnly:true,
    secure:true
  }

  return res.status(200)
            .cookie('accessToken',accessToken,options)
            .cookie('refreshToken',refreshToken,options)
            .json(
              new ApiResponse(
                200,
                {user:loggedInUser,accessToken,refreshToken},
                'User logged in Successfully!!'
              )
            )

})

const logoutUser = asyncHandler( async (req,res) =>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset:{refreshToken:1}
    },
    {
      new:true
    }
  )
  
  const options = {
    httpOnly:true,
    secure:true
  }

  return res.status(200)
            .clearCookie('accessToken',options)
            .clearCookie('refreshToken',options)
            .json(
              new ApiResponse(200,{},'User Logged Out!!')
            )
})

const refreshAccessToken = asyncHandler( async(req,res) =>{
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken
  if(!incomingRefreshToken){
    throw new ApiError(401,'Unauthorized request!!')
  }

  try {
    const decodedToken = jsonwebtoken.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  
    const user = await User.findById(decodedToken?._id)
    if(!user){
      throw new ApiError(401,'Invalid refresh token!!')
    }
  
    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401,'Refresh token expired!!')
    }
  
    const options={
      httpOnly:true,
      secure:true
    }
  
    const {accessToken,newRefreshToken} = await generateTokens(user._id)
  
    return res.status(200)
              .cookie('accessToken',accessToken,options)
              .cookie('refreshToken',newRefreshToken,options)
              .json(
                new ApiResponse(
                  200,
                  {accessToken,refreshToken:newRefreshToken},
                  'Refreshed Successfully!!')
              )
  } catch (error) {
    throw new ApiError(401,error?.message || 'Invalid RefreshToken!!')
  }
})

const changeCurrentPassword = asyncHandler( async(req,res) =>{
  const {oldPassword,newPassword,confirmPassword} = req.body

  if(newPassword !== confirmPassword){
    throw new ApiError(401,'Password Mismatch!!')
  }

  const user = await User.findById(req.user?._id)

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect){
    throw new ApiError(400,'Invalid Password')
  }

  user.password = newPassword
  await user.save({validateBeforeSave:false})

  return res.status(200)
            .json(new ApiResponse(200,{},'Password changed successfully!!'))
})

const getCurrentUser = asyncHandler( async(req,res) =>{
  return res.status(200)
            .json(200,req.user,'Fetched Current User!!')
})

const updateAccountDetail = asyncHandler( async(req,res) =>{
  const {fullname,email} = req.body
  
  if(!(fullname || email)){
    throw new ApiError(400,'All fields are required!!')
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{fullname,email}
    },
    {
      new:true
    }
  ).select('-password')

  return res.status(200)
            .json(new ApiResponse(200,user,'Account updated!!'))
})

const updateUserAvatar = asyncHandler( async(req,res) =>{
  const avatarLocalPath = req.file?.path
  if(!avatarLocalPath){
    throw new ApiError(400,'Avatar file is missing!!')
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  if(!avatar){
    throw new ApiError(400,'Error while Avatar uploading!!')
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar:avatar.url
      }
    },
    {
      new:true
    }
  ).select('-password -refreshToken')
  // delete the previous avatar
  
  return res.status(200)
            .json(200,{user},'Avatar Updated!!')
})

const updateUserCoverImage = asyncHandler( async(req,res) =>{
  const coverImageLocalPath = req.file?.path
  if(!coverImageLocalPath){
    throw new ApiError(400,'Cover Image file is missing!!')
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if(!coverImage){
    throw new ApiError(400,'Error while Cover Image uploading!!')
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage:coverImage.url
      }
    },
    {
      new:true
    }
  ).select('-password -refreshToken')

  return res.status(200)
            .json(200,{user},'Cover Image Updated!!')
})

const getUserChannelProfile = asyncHandler( async(req,res) =>{
  const {username} = req.params

  if(!username?.trim()){
    throw new ApiError(400,'Username is missing!!')
  }

  const channel = await User.aggregate([
    {
      $match:{
        username:username?.toLowerCase()
      },
      $lookup:{ // 2nd stage: how many subscribers this channel have
        from:'subscriptions',
        localField:'_id',
        foreignField:'channel',
        as:'subscribers'
      }
    },
    {
      $lookup:{ // how many channels user subscribed
        from:'subsciptions',
        localField:'_id',
        foreignField:'subscriber',
        as:'subscribedTo'
      }
    },
    { 
      $addFields:{
        subscribersCount:{
          $size:'$subscribers'
        },
        channelsSubscribedToCount:{
          $size:'$subscribedTo'
        },
        isSubscribed:{
          $cond:{
            if:{$in:[req.user?._id,"$subscribers.subscriber"]},
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project:{
        fullname:1,
        username:1,
        subscribersCount:1,
        channelsSubscribedToCount:1,
        isSubscribed:1,
        avatar:1,
        coverImage:1,
        email:1
      }
    }
  ])
  // console.log(channel)
  if(!channel?.length){
    throw new ApiError(404,"Channel doesn't exist!!")
  }

  return res.status(200)
            .json(
              new ApiResponse(200,channel[0],'User Channel fetched!!'
            ))
})

const getWatchHistory = asyncHandler( async(req,res) =>{
  const user = await User.aggregate([
    {
      $match:{
      _id:new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup:{
        from:'videos',
        localField:'watchHistory',
        foreignField:'_id',
        as:'watchHistory',
        pipeline:[
          {
            $lookup:{
              from:'users',
              localField:'owner',
              foreignField:'_id',
              as:'owner',
              pipeline:[
                {
                  $project:{
                    fullname:1,
                    username:1,
                    avatar:1
                  }
                }
              ]
            }
          },
          {
            $addFields:{
              owner:{
                $first:'$owner'
              }
            }
          }
        ]
      }
    }
  ])

  return res.status(200)
            .json(200,
              user[0].watchHistory,
              'Watch history fetched!!'
            )
})

export {  registerUser,
          loginUser,
          logoutUser,
          refreshAccessToken,
          changeCurrentPassword,
          getCurrentUser,
          updateAccountDetail,
          updateUserAvatar,
          updateUserCoverImage,
          getUserChannelProfile,
          getWatchHistory
        }