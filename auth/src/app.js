import express from 'express'
import cookieParser from 'cookie-parser'
import routes from './routes/auth.routes.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',routes)



export default app