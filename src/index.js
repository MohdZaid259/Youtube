import 'dotenv/config.js'
import connectDB from "./db/index.js";
import app from './app.js'

connectDB()
  .then(()=>{
    app.listen(8000, () => {
      console.log('Server is running on http://localhost:8000');
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