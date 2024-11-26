import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import 'dotenv/config.js'

const connectDB = async () => {
  try {
    const dbInstant = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`\n DB connected !! DB Host: ${dbInstant.connection.host}`)
  } catch (err) {
    console.log('dbConnect: ',err)
    throw err
    // process.exit(1) 
  }
}

export default connectDB