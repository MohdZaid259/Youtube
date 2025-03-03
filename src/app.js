import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({ // setting cors
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
// - for testing only -
// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,  // if you're using cookies or authentication
// }));
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

const specs = swaggerJsdoc(options)
const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css';

app.use(
  '/api-docs',
  swaggerUi.serveFiles(specs,options),
  swaggerUi.setup(specs,{
    customCss: '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL
  })
)

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

app.use('/',(req,res)=>res.send("Site working alright!"))

export default app