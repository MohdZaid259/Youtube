import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import subscriptionService from '../services/subscription.service.js'

const toggleSubscription = asyncHandler( async(req,res) => {
  const {channelId} = req.params

  const isSubscribed = await subscriptionService.findOne({
    channel:channelId,
    subscriber:req.user?._id
  })

  if(isSubscribed){
    await subscriptionService.findByIdAndDelete(isSubscribed._id)

    return res.status(200).json(
      new ApiResponse(200,{},'Unsubscribed!')
    )
  }

  const subscribed = await subscriptionService.create({
    channel:channelId,
    subscriber:req.user?._id
  })

  if(!subscribed){
    throw new ApiError(500,"Couldn't subscribe!")
  }

  return res.status(200).json(
    new ApiResponse(200,subscribed,'Subscribed!')
  )
})

const getChannelSubscribers = asyncHandler( async(req,res) => {

})

const getSubscribedChannels = asyncHandler( async(req,res) => {

})

export {toggleSubscription, getChannelSubscribers, getSubscribedChannels}