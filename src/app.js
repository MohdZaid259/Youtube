import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// using 'use' instead of 'get' for configuring middleware
app.use(cors(
  {
  origin:process.env.CORS_ORIGIN,
  credentials:true
  }
))
app.use(express.json({limit:'16kb'})) // gets json data from form
app.use(express.urlencoded({extended:true,limit:'16kb'})) // gets data from url
// 'extended' for objects into object in data
app.use(express.static('public')) // get files/asset
app.use(cookieParser()) // access & set cookies in browser

// routes 
import userRouter from './routes/user.route.js'

// using a middleware 'use' instead of 'get' bcz we've router in another file
app.use('/api/v1/user',userRouter)

// https://localhost:8000/api/v1/user/register  <- looks like
export { app }