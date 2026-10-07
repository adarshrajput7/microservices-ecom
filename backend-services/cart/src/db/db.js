// import mongoose from "mongoose";


// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.CART_MONGO_URI)
//         // await mongoose.connect(process.env.MONGO_URI)
//         console.log("Cart MongoDB connected");
        
//     } catch (error) {
//         console.error("🚀 ~ connectDB ~ error:", error)
//     }
// }


// export default connectDB

import mongoose from "mongoose";

let cartDbConnection = null;

const connectDB = async () => {
    try {
        if (!cartDbConnection) {
            cartDbConnection = mongoose.createConnection(process.env.CART_MONGO_URI);
            await cartDbConnection.asPromise();
            console.log("Cart MongoDB connected");
        }
        return cartDbConnection;
    } catch (error) {
        console.error("🚀 ~ Cart connectDB ~ error:", error);
    }
};

export default connectDB;