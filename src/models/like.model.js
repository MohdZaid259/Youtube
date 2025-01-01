import mongoose,{Schema} from "mongoose";

const likeSchema = new Schema({
  video:{
    type:Schema.Types.ObjectId,
    ref:'Video'
  },
  comment:{
    type:Schema.Types.ObjectId,
    ref:'Comment'
  },
  reply:{
    type:Schema.Types.ObjectId,
    ref:'Reply'
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:'User'
  }
},{timestamps:true})

export const Like = mongoose.model('Like',likeSchema)