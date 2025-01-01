import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import commentService from "../services/comment.service.js";
import replyService from "../services/reply.service.js";

const addReply = asyncHandler( async(req,res) => {
  const {content} = req.body
  const commentId = req.params

  const comment = await commentService.findCommentById(commentId)

  if(!comment){
    throw new ApiError(404,'Comment not found!')
  }

  const reply = await replyService.create({
    content,
    ParentComment:commentId,
    owner:req.user?._id
  })

  comment.replies.push(reply?._id)
  await comment.save()

  return res.status(200).json(
    new ApiResponse(200,reply,'Reply added successfully!')
  )
})

const deleteReply = asyncHandler( async(req,res) => {
  const replyId = req.params

  const reply = await replyService.findById(replyId)

  if(!reply){
    throw new ApiError(404,'Reply not found!')
  }

  if(!(req.user?._id.toString()===reply.owner.toString())){
    return new ApiError(401,'Unauthorized request!')
  }

  const isDeleted = await replyService.findByIdAndDelete(replyId)

  if(!isDeleted){
    throw new ApiError(500,"Couldn't delete!")
  }

  await replyService.deleteLikes(replyId)

  return res.status(200).json(
    new ApiResponse(200,{},'Reply Deleted!')
  )
})

const editReply = asyncHandler( async(req,res) => {
  const replyId = req.params
  const content = req.body

  const reply = await replyService.findById(replyId)

  if(!reply){
    throw new ApiError(404,'Reply not found!')
  }

  if(!(req.user?._id.toString()===reply.owner.toString())){
    return new ApiError(401,'Unauthorized request!')
  }

  const editedReply = await replyService.findByIdAndUpdate(
    replyId,
    {
      $set:{
        content
      }
    }
  )

  if(!editedReply){
    throw new ApiError(500,"Couldn't update!")
  }

  return res.status(200).json(
    new ApiResponse(200,editedReply,'Reply Edited!')
  )
})

export { addReply, deleteReply, editReply }