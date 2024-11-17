import { Like } from '../models/like.model'

const findOne = async(data) => {
  return await Like.findOne(data)
}

const findByIdAndDelete = async(data) => {
  return await Like.findByIdAndDelete(data)
}

const create = async(data) => {
  return await Like.create(data)
}

export default {findOne, findByIdAndDelete, create}