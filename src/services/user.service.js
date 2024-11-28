import { User } from "../models/user.model.js";
import { uploadOnCloudinary,deleteFromCloudinary } from '../utils/cloudinary.js'

const createUser = async(userData) => {
  return await User.create(userData)
}

const findUserById = async(userId,remove=true) => {
  if(remove){
    return await User.findById(userId).select("-password -refreshToken")
  }else{
    return await User.findById(userId)
  }
}

const findOneUser = async(data) => {
  return await User.findOne(data)
}

const updateUserById = async(userId,updateData,options={}) => {
  return await User.findByIdAndUpdate(userId,updateData,{new:true,...options})
}

const uploadAvatar = async(avatarLocalPath) =>{
  return await uploadOnCloudinary(avatarLocalPath)
}

const uploadCoverImage = async(coverImageLocalPath) =>{
  return await uploadOnCloudinary(coverImageLocalPath)
}

const deleteAvatar = async(avatarUrl) => {
  return await deleteFromCloudinary(avatarUrl)
}
const deleteCoverImage = async(coverImageUrl) => {
  return await deleteFromCloudinary(coverImageUrl)
}

export default {createUser, findUserById, findOneUser, updateUserById, uploadAvatar, uploadCoverImage, deleteAvatar, deleteCoverImage}