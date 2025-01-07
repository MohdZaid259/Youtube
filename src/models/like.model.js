import mongoose,{Schema} from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Like:
 *       type: object
 *       required:
 *         - video
 *         - owner
 *       properties:
 *         video:
 *           type: string
 *           description: The ID of the associated video
 *           example: 60c72b2f9e1d8b18a1d0f8e1
 *         comment:
 *           type: string
 *           description: The ID of the associated comment (optional)
 *           example: 60c72b2f9e1d8b18a1d0f8e2
 *         reply:
 *           type: string
 *           description: The ID of the associated reply (optional)
 *           example: 60c72b2f9e1d8b18a1d0f8e3
 *         owner:
 *           type: string
 *           description: The ID of the user who owns the like
 *           example: 60c72b2f9e1d8b18a1d0f8e4
 */
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