import mongoose  from "mongoose";
import dotenv from "dotenv";

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI_ONLINE);
        console.log('sucessfully connected to mongoDB')
    } catch (error) {
        console.error(`error ${error.message}`);
        process.exit(1)
    }
}

export default connectDB;