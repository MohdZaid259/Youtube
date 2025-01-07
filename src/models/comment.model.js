import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - owner
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the comment
 *           example: "This is a great video!"
 *         video:
 *           type: string
 *           description: The ID of the associated video
 *           example: 60c72b2f9e1d8b18a1d0f8e1
 *         owner:
 *           type: string
 *           description: The ID of the user who owns the comment
 *           example: 60c72b2f9e1d8b18a1d0f8e2
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of Like IDs associated with the comment
 *           example: [ "60c72b2f9e1d8b18a1d0f8e3", "60c72b2f9e1d8b18a1d0f8e4" ]
 *         replies:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of Reply IDs associated with the comment
 *           example: [ "60c72b2f9e1d8b18a1d0f8e5" ]
 */

const commentSchema = new Schema({
  content:{
    type:String,
    required:true
  },
  video:{
    type:Schema.Types.ObjectId,
    ref:'Video'
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
  ],
  replies:[
    {
      type:Schema.Types.ObjectId,
      ref:'Reply'
    }
  ]
},{timestamps:true})

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model('Comment',commentSchema)