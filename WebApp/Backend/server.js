require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const courseRoutes = require('./routes/courseRoute')
const userRoutes = require('./routes/userRoute')

// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/courses', courseRoutes)
app.use('/users', userRoutes)

// connect to db
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 