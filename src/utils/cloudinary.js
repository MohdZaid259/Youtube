import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import 'dotenv/config.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
  try{
    if(!localFilePath){
      throw new Error('localFilePath not found')
    } 
    const response = await cloudinary.uploader.upload(localFilePath,{resource_type:'auto'})
    fs.unlinkSync(localFilePath) 
    return response
  }catch(err){
    console.log('cloudinary', err)
    fs.unlinkSync(localFilePath)
    return null
  }
}

const deleteFromCloudinary = async () => {
  try {
    
  } catch (err) {
    
  }
}

export {uploadOnCloudinary,deleteFromCloudinary}