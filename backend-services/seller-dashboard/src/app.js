import express from 'express'
import cookieParser from 'cookie-parser'
import sellerRouter from './routes/seller.routes.js'



const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: [
      'http://localhost:5173', 
      'https://your-app-name.vercel.app' 
    ], 
    credentials: true, // Important for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
    res.status(200).json({
        message:'Seller Dashboard Service is running.'
    })
})

app.use('/api/seller/dashboard', sellerRouter)

export default app