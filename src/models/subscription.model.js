import mongoose, {Schema} from "mongoose";

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