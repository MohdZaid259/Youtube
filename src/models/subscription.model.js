import mongoose, {Schema} from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       required:
 *         - subscriber
 *         - channel
 *       properties:
 *         subscriber:
 *           type: string
 *           description: ObjectId of the user who subscribed to a channel
 *           example: "64e1f8c6f917b9c054fb1234"
 *         channel:
 *           type: string
 *           description: ObjectId of the channel the user subscribed to
 *           example: "64e1f8d6f917b9c054fb5678"
 */
const subscriptionSchema = new Schema({
  subscriber:{ // who subscribed you
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  channel:{ // who you subscribed
    type:Schema.Types.ObjectId,
    ref:'User'
  }
},{timestamps:true})

export const Subscription = mongoose.model('Subscription',subscriptionSchema)