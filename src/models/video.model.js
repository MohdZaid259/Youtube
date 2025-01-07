import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - videoFile
 *         - thumbnail
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the video (MongoDB ObjectId)
 *           example: 64dff2b6f917b9c054fb1234
 *         videoFile:
 *           type: string
 *           description: URL of the video file
 *           example: https://example.com/videos/video.mp4
 *         thumbnail:
 *           type: string
 *           description: URL of the video's thumbnail image
 *           example: https://example.com/images/thumbnail.jpg
 *         title:
 *           type: string
 *           description: Title of the video
 *           example: "Introduction to React"
 *         description:
 *           type: string
 *           description: A detailed description of the video
 *           example: "This video provides an introduction to React.js fundamentals."
 *         duration:
 *           type: string
 *           description: Duration of the video (in HH:MM:SS format)
 *           example: "00:15:30"
 *         views:
 *           type: integer
 *           description: Number of views the video has received
 *           example: 1500
 *         isPublished:
 *           type: boolean
 *           description: Whether the video is published or not
 *           example: true
 *         owner:
 *           type: string
 *           description: The ID of the user who owns the video
 *           example: 64dff2b6f917b9c054fb1234
 *         likes:
 *           type: array
 *           description: Array of ObjectIds referencing likes on the video
 *           items:
 *             type: string
 *             description: ObjectId of a Like
 *           example: ["64e0f2c6f917b9c054fb5678", "64e0f2d6f917b9c054fb5679"]
 *         comments:
 *           type: array
 *           description: Array of ObjectIds referencing comments on the video
 *           items:
 *             type: string
 *             description: ObjectId of a Comment
 *           example: ["64e0f2e6f917b9c054fb6789", "64e0f2f6f917b9c054fb6790"]
 */
const videoSchema = new Schema({
  videoFile:{
    type:String,
    required:true
  },
  thumbnail:{
    type:String,
    required:true
  },
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true,
  },
  duration:{
    type:String,
    required:true
  },
  views:{
    type:Number,
    default:0
  },
  isPublished:{
    type:Boolean,
    default:true
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
  comments:[
    {
      type:Schema.Types.ObjectId,
      ref:'Comment'
    }
  ]
},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model('Video',videoSchema)