// require('dotenv').config({path:'./env'})
import { configDotenv } from 'dotenv'
import mongoose from "mongoose";
import { DB_NAME } from './constants.js'
import connectDB from "./db/index.js";

configDotenv({path:'./.env'})

connectDB()


/*
import express from 'express'
const app = express()

;(async ()=>{
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on('error',(err)=>{
      console.log('Err on express-db connect: ',err)
      throw err
    })
    app.listen(process.env.PORT,()=>{
      console.log(`App is listening on port ${process.env.PORT}`)
    })
  } catch (err) {
    console.log('Err on dbConnect: ',err)
    throw err
  }
})()
*/