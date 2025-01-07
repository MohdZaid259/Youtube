import mongoose,{Schema} from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Reply:
 *       type: object
 *       required:
 *         - content
 *         - ParentComment
 *         - owner
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the reply
 *           example: "This is a reply to a comment."
 *         ParentComment:
 *           type: string
 *           description: ObjectId of the parent comment being replied to
 *           example: "64e1f8c6f917b9c054fb1234"
 *         owner:
 *           type: string
 *           description: ObjectId of the user who posted the reply
 *           example: "64e1f8d6f917b9c054fb5678"
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: List of ObjectIds of likes associated with the reply
 *           example: ["64e1f8c6f917b9c054fb1234", "64e1f8d6f917b9c054fb5678"]
 */
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