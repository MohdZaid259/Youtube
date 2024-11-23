import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
  destination: function (req,file,cb){
    console.log('multer file ',file)
    cb(null,path.resolve('.'))
  },
  filename: function (req,file,cb){
    // console.log(file)
    cb(null,file.originalname)
  }
})

export const upload = multer({ storage })