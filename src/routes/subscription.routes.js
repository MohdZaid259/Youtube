import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import validation from "../middlewares/validation.middleware.js";
import {toggleSubscription,getChannelSubscribers,getSubscribedChannels} from '../controllers/subscription.controller.js'

const subscriptionRouter = Router()

subscriptionRouter.use(verifyJWT)

subscriptionRouter.route('/:channelId').post(validation.channelId,toggleSubscription)
                                      .get(validation.channelId,getChannelSubscribers)
                                      .get(validation.channelId,getSubscribedChannels)

export default subscriptionRouter