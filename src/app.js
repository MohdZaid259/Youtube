import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// use is kinda middleware?? adding basic things
app.use(cors({ // setting cors
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
app.use(express.json({ // data coming in json format
  limit:'16kb'
}))
app.use(express.urlencoded({ // data coming from urls
  extended:true,
  limit:'16kb'
}))
app.use(express.static('public')) // storing assets
app.use(cookieParser()) // to set-get browser's cookies

// routes import
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import commentRouter from './routes/comment.routes.js'

// routes declaration
app.use('/api/v1/user',userRouter)
app.use('/api/v1/video',videoRouter)
app.use('/api/v1/comment',commentRouter)

export default app