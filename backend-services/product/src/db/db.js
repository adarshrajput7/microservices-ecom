import mongoose from "mongoose";


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.PRODUCT_MONGO_URI)
        // await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected");
        
    } catch (error) {
        console.error("🚀 ~ connectDB ~ error:", error)
    }
}


export default connectDB