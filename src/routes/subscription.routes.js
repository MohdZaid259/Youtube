import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import validation from "../middlewares/validation.middleware.js";
import {toggleSubscription,getChannelSubscribers,getSubscribedChannels} from '../controllers/subscription.controller.js'

const subscriptionRouter = Router()

subscriptionRouter.use(verifyJWT)

subscriptionRouter.route('/subscription/:channelId').post(validation.channelId,toggleSubscription)
