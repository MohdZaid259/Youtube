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
  const {channelId} = req.params

  const subscriberCount = await subscriptionService.countDocuments({ channelId });

  if(!subscriberCount){
    throw new ApiError(500,"Couldn't fetch subscriber count!")
  }

  return res.status(200).json(
    new ApiResponse(200,{subscriberCount},'Subscriber Count fetched!')
  )
})

const getSubscribedChannels = asyncHandler( async(req,res) => {
  const { userId } = req.params;

  const subscriptions = await subscriptionService.find({ subscriberId: userId }).populate('channelId', 'username');

  if(!subscriptions){
    throw new ApiError(500,"Couldn't fetch channel count!")
  }

  return res.status(200).json(
    new ApiResponse(200,{subscriptions},'subscriptions Count fetched!')
  )
})

export {toggleSubscription, getChannelSubscribers, getSubscribedChannels}