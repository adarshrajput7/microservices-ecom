import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/db/db.js";

dotenv.config()
const PORT = 3001


connectDB()
app.listen(PORT, () => {
    console.log("Product service running on port no 3001");
})