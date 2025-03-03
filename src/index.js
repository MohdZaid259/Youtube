import 'dotenv/config.js'
import connectDB from "./db/index.js";
import app from './app.js'
import serverless from 'serverless-http';

let handler;
// const port = process.env.PORT || 8000;

connectDB()
  .then(()=>{
    // app.listen(port, () => {
    //   console.log(`Server is running on http://localhost:${port}`);
    // })
    handler = serverless(app); 
  })
  .catch((err)=>{
    console.log('dbConnection failed ',err)
  })

export {handler}