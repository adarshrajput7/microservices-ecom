import app from "./src/app.js";
import dotenv from 'dotenv'
import connectDB from "./src/db/db.js";

dotenv.config()


const PORT = 3000;


connectDB()
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})