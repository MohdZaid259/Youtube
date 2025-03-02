import 'dotenv/config.js'
import connectDB from "./db/index.js";
import app from './app.js'

const port = process.env.PORT || 8000;

connectDB()
  .then(()=>{
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    })
    app.on('error',(err)=>{
      console.log('Err on express-db connect: ',err)
      throw err
    })
  })
  .catch((err)=>{
    console.log('dbConnection failed ',err)
  })

export default app