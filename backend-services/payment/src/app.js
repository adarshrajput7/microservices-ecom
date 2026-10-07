import express from 'express'
import cookieParser from 'cookie-parser'
import paymentRoutes from './routes/payment.routes.js'
import cors from 'cors'



const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: [
      'http://localhost:5173', 
      'https://microservices-ecom-six.vercel.app',
      'https://microservices-ecom-h2ok8m9bc-adarsh-6a50.vercel.app'
    ], 
    credentials: true, // Important for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.get('/', (req, res) => {
    res.status(200).json({
        message:'Payment Service is running.'
    })
})

app.use('/api/payments',paymentRoutes)





export default app
