// import mongoose from "mongoose";


// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.SELLER_MONGO_URI)
//         // await mongoose.connect(process.env.MONGO_URI)
//         console.log("Seller-Dashboard MongoDB connected");
        
//     } catch (error) {
//         console.error("🚀 ~ connectDB ~ error:", error)
//     }
// }

// export default connectDB

import mongoose from "mongoose";

let sellerDbConnection = null;

const connectDB = async () => {
    try {
        if (!sellerDbConnection) {
            sellerDbConnection = mongoose.createConnection(process.env.SELLER_MONGO_URI || process.env.MONGO_URI);
            await sellerDbConnection.asPromise();
            console.log("Seller-Dashboard MongoDB connected");
        }
        return sellerDbConnection;
    } catch (error) {
        console.error("🚀 ~ Seller connectDB ~ error:", error);
    }
};

export default connectDB;