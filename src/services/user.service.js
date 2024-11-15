import { User } from "../models/user.model";

const createUser = async(userData) => {
  return await User.create(userData)
}

const findUserById = async(userId) => {
  return await User.findById(userId)
}

const findOneUser = async(data) => {
  return await User.findOne(data)
}

const updateUserById = async(userId,updateData,options={}) => {
  return await User.findByIdAndUpdate(userId,updateData,{new:true,...options})
}

export default {createUser, findUserById, findOneUser, updateUserById}