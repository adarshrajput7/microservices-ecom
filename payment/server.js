import app from "./src/app.js";
import dotenv from 'dotenv'
import connectDB from "./src/db/db.js";


dotenv.config()

const PORT = 3004



connectDB()
app.listen(PORT, () => {
    console.log("Payment service is running on ", PORT)
})