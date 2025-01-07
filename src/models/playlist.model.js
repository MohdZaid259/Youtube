import mongoose,{Schema} from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Playlist:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - owner
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the playlist
 *           example: "My Favorite Videos"
 *         description:
 *           type: string
 *           description: A brief description of the playlist
 *           example: "A collection of my favorite tutorial videos."
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *           description: List of ObjectIds of videos included in the playlist
 *           example: ["64e1f8c6f917b9c054fb1234", "64e1f8d6f917b9c054fb5678"]
 *         owner:
 *           type: string
 *           description: ObjectId of the user who owns the playlist
 *           example: "64e1f8c6f917b9c054fb1234"
 */
const playlistSchema = new Schema({
  name:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  videos:[
    {
      type:Schema.Types.ObjectId,
      ref:'Video'
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:'User'
  }
},{timestamps:true})

export const Playlist = mongoose.model('Playlist',playlistSchema)