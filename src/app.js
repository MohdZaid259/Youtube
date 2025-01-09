import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

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

import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { options } from './swaggerConfig.js'
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';

const specs = swaggerJsdoc(options)

app.use(
  '/api-docs',
  swaggerUi.serveFiles(specs,options),
  swaggerUi.setup(specs,options)
)

app.get('/testing',(req,res)=>{
  res.send("It's working alright!")
})

// routes import
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import commentRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'
import replyRouter from './routes/reply.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'

// routes declaration
app.use('/api/v1/user',userRouter)
app.use('/api/v1/video',videoRouter)
app.use('/api/v1/comment',commentRouter)
app.use('/api/v1/like',likeRouter)
app.use('/api/v1/reply',replyRouter)
app.use('/api/v1/subscription',subscriptionRouter)

export default app