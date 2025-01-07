import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - fullname
 *         - avatar
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Unique username of the user
 *           example: "john_doe"
 *         email:
 *           type: string
 *           description: Email address of the user
 *           format: email
 *           example: "john.doe@example.com"
 *         fullname:
 *           type: string
 *           description: Full name of the user
 *           example: "John Doe"
 *         avatar:
 *           type: string
 *           description: URL of the user's avatar image (from Cloudinary)
 *           example: "https://res.cloudinary.com/demo/image/upload/v123456789/avatar.jpg"
 *         coverImage:
 *           type: string
 *           description: URL of the user's cover image (optional)
 *           example: "https://res.cloudinary.com/demo/image/upload/v123456789/cover.jpg"
 *         watchHistory:
 *           type: array
 *           items:
 *             type: string
 *             description: ObjectId of a video watched by the user
 *           description: Array of video IDs that the user has watched
 *           example: ["64e1f8c6f917b9c054fb1234", "64e1f8d6f917b9c054fb5678"]
 *         password:
 *           type: string
 *           description: User's password (hashed)
 *           example: "$2b$10$C6UzMDM.H6dfI/f/IKy.tO4Jjyt1woUyzQXr.aL06sl/X/52Twvly"
 *         refreshToken:
 *           type: string
 *           description: Refresh token for user authentication (optional)
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // can't use arrow fn as it doesnt hold reference
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};

export const User = mongoose.model("User", userSchema);
