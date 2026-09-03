import express from 'express'
import cookieParser from 'cookie-parser'
import routes from './routes/cart.route.js'


const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/cart',routes)




export default app