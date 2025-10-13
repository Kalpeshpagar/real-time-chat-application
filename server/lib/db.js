import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB cluster')});
        await mongoose.connect(`${process.env.MONGODB_URL}/chat-app` )
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }   
};

