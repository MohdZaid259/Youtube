import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'

const verifyJWT = asyncHandler( async( req, _, next) => {
  try {
    console.log('backend')
    console.log('req ',req.body)
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ','')
    console.log('token', token)
    console.log(req.cookies)

    if(!token){
      throw new ApiError(401,'Unauthorized Request!')
    }
  
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
    const user = await User.findById(decodedToken._id).select("-password -refreshToken")
  
    if(!user){
      throw new ApiError(401,'Invalid Access Token!')
    }
  
    req.user=user
    next()

  } catch (err) {
    throw new ApiError(401,err?.message || 'Invalid Access Token!')
  }
})

export { verifyJWT }