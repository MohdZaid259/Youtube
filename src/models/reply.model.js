import mongoose,{Schema} from "mongoose";

const replySchema = new Schema({
  content:{
    type:String,
    required:true
  },
  ParentComment:{
    type:Schema.Types.ObjectId,
    ref:'Commment'
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  likes:[
    {
      type:Schema.Types.ObjectId,
      ref:'Like'
    }
  ]
},{timestamps:true})

export const Reply = mongoose.model('Reply',replySchema)