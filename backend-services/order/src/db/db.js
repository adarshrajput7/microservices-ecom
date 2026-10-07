import mongoose from "mongoose";

let dbConnection = null;
const connectDB = async () => {
    try {
        if (!dbConnection) {
            dbConnection = mongoose.createConnection(process.env.ORDER_MONGO_URI || process.env.MONGO_URI);
            await dbConnection.asPromise();
            console.log('Order MongoDB connected');
        }
        return dbConnection;
        
    } catch (error) {
        console.error("🚀 ~ connectDB ~ error:", error)
    }
}

export default connectDB