// import mongoose from "mongoose";


// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.PAYMENT_MONGO_URI)
//         // await mongoose.connect(process.env.MONGO_URI)
//         console.log("Payment MongoDB connected");
        
//     } catch (error) {
//         console.error("🚀 ~ connectDB ~ error:", error)
//     }
// }


// export default connectDB

import mongoose from "mongoose";

let paymentDbConnection = null;

const connectDB = async () => {
    try {
        if (!paymentDbConnection) {
            paymentDbConnection = mongoose.createConnection(process.env.PAYMENT_MONGO_URI || process.env.MONGO_URI);
            await paymentDbConnection.asPromise();
            console.log("Payment MongoDB connected");
        }
        return paymentDbConnection;
    } catch (error) {
        console.error("🚀 ~ Payment connectDB ~ error:", error);
    }
};

export default connectDB;