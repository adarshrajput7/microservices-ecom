import express from 'express'
import cookieParser from 'cookie-parser'
import orderRoutes from './routes/order.routes.js'

const app = express()
app.use(express.json())
app.use(cookieParser())


app.get('/', (req, res) => {
    res.status(200).json({
        message:'Order Service is running.'
    })
})

app.use('/api/order',orderRoutes)





export default app