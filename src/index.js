import 'dotenv/config.js'
import connectDB from "./db/index.js";
import app from './app.js'

connectDB()
  .then(()=>{
    app.on('error',(err)=>{
      console.log('Err on express-db connect: ',err)
      throw err
    })
    app.listen(process.env.PORT || 8000,()=>{
      console.log(`server running at port: ${process.env.PORT}`)
    })
  })
  .catch((err)=>{
    console.log('dbConnection failed ',err)
  })