import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Reply } from "../models/reply.model.js";

const findById = async(replyId) => {
  return await Reply.findById(replyId)
}

const findByIdAndDelete = async(replyId) => {
  return await Reply.findByIdAndDelete(replyId)
}

const findByIdAndUpdate = async(replyId,data) => {
  return await Reply.findByIdAndUpdate(replyId,data)
}

const create = async(data) => {
  return await Reply.create(data)
}

const deleteLikes = async(replyId) => {
  return await Like.deleteMany({reply:replyId})
}

export default { findById, findByIdAndDelete, create, findByIdAndUpdate, deleteLikes }