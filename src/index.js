import 'dotenv/config.js'
import connectDB from "./db/index.js";
import app from './app.js'
import serverless from 'serverless-http';

let handler;

connectDB()
  .then(()=>{
    app.on('error',(err)=>{
      console.log('Err on express-db connect: ',err)
      throw err
    })
    handler = serverless(app); 
  })
  .catch((err)=>{
    console.log('dbConnection failed ',err)
  })

export default handler 