/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: API endpoints for subscriptions management.
 */

import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import validation from "../middlewares/validation.middleware.js";
import {toggleSubscription,getChannelSubscribers,getSubscribedChannels} from '../controllers/subscription.controller.js'

const subscriptionRouter = Router()

subscriptionRouter.use(verifyJWT)

/**
 * @swagger
 * /subscription/{channelId}:
 *   post:
 *     summary: Toggle subscription for a channel.
 *     tags: [Subscription]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Invalid channel ID.
 *   get:
 *     summary: Get subscribers for a channel.
 *     tags: [Subscription]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Invalid channel ID.
 */
subscriptionRouter.route('/:channelId').post(validation.channelId,toggleSubscription)
                                      .get(validation.channelId,getChannelSubscribers)

/**
 * @swagger
 * /subscription/{channelId}:
 *   get:
 *     summary: Get channels the user is subscribed to.
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: channelId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user.
 *     responses:
 *       200:
 *         description: List of subscribed channels.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subsription'
 *       400:
 *         description: Invalid channel ID.
 */
subscriptionRouter.route('/:channelId').get(validation.channelId,getSubscribedChannels)

export default subscriptionRouter