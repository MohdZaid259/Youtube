/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: API endpoints for managing subscriptions.
 */

import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import validation from "../middlewares/validation.middleware.js";
import {toggleSubscription,getChannelSubscribers,getSubscribedChannels} from '../controllers/subscription.controller.js'

const subscriptionRouter = Router()

subscriptionRouter.use(verifyJWT)

/**
 * @swagger
 * /subscriptions/c/{channelId}:
 *   post:
 *     summary: Toggle subscription for a channel.
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: channelId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the channel to subscribe/unsubscribe.
 *     responses:
 *       200:
 *         description: Successfully toggled subscription.
 *       400:
 *         description: Invalid channel ID.
 *   get:
 *     summary: Get subscribers for a channel.
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: channelId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the channel to fetch subscribers.
 *     responses:
 *       200:
 *         description: List of channel subscribers.
 *       400:
 *         description: Invalid channel ID.
 */
subscriptionRouter.route('/c/:channelId').post(validation.channelId,toggleSubscription)
                                      .get(validation.channelId,getChannelSubscribers)

/**
 * @swagger
 * /subscriptions/u/{userId}:
 *   get:
 *     summary: Get channels the user is subscribed to.
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user.
 *     responses:
 *       200:
 *         description: List of subscribed channels.
 *       400:
 *         description: Invalid channel ID.
 */
subscriptionRouter.route('/u/:userId').get(validation.channelId,getSubscribedChannels)

export default subscriptionRouter