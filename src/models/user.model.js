import mongoose,{Schema} from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    username:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
      index:true
    },
    email:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
    },
    fullname:{
      type:String,
      required:true,
      unique:true,
      trim:true,
      index:true
    },
    avatar:{
      type:String, // cloudinary url
      required:true
    },
    coverImage:{
      type:String // cloudinary url
    },
    email:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
    },
    watchHistory:[
      {
        type:Schema.Types.ObjectId,
        ref:'Video'
      }
    ],
    password:{
      type:String,
      required:[true,'Password is required']
    },
    refreshToken:{
      type:String
    }
  },{timestamps:true})

userSchema.pre('save', async function(next){
  if (!this.isModified('password')) return next() // to encrypt password only when password field is updated 
  this.password = await bcrypt.hash(this.password,10)
  next() // we've to use next flag to pass the control as we are using 'pre' middleware 
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password)
} // here we're creating a custom method 'isPasswordCorrect' using the keyword 'methods'

userSchema.methods.generateAccessToken = function(){
  return jsonwebtoken.sign(
    {
      _id:this._id, // this._id & all right side data are coming from mongoDB
      email:this.email,
      username:this.username,
      fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateRefreshToken = async function(){
  return jsonwebtoken.sign(
    {
      _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model('User',userSchema)