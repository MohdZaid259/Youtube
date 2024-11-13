import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
  try{
    if(!localFilePath){
      throw new Error('localFilePath not found')
      return null
    } 
    const response = await cloudinary.uploader.upload(localFilePath,{resource_type:'auto'})
    // fs.unlinkSync(localFilePath) 
    return response
    
  }catch(err){
    console.log(err)
    fs.unlinkSync(localFilePath) // removes locally saved file if err happens
    return null
  }
}

const deleteFromCloudinary= () => {

}

export {uploadOnCloudinary,deleteFromCloudinary}