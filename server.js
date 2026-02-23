const express = require('express')
const dotenv = require('dotenv')
const {connection} = require('./config/connection')
const {globleErrorHandler} = require('./utils/globleErrorHandler') 
const userRoutes = require('./routes/user.route')
const adminRoutes = require('./routes/admin.route')
const cookieparser = require('cookie-parser')
dotenv.config()
const app = express()

app.use(express.json())
app.use(cookieparser())

connection()

app.use('/api/user/',userRoutes)

app.use('/api/admin/',adminRoutes)

app.use(globleErrorHandler)


app.listen(process.env.PORT || 5000,()=>{
    console.log(`server is running on port ${process.env.PORT || 5000}`)
})