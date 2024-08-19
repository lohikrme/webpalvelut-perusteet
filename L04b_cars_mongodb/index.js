// index.js
// 19th august 2024

import express from 'express'
import router from './routes.js'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import mongoPassword from './password.js'

const app = express()
const port = 3000

// always add middlewares such as bodyParser before router, 
// becasue bodyparser sets req.body objects
// before router receives these objects
app.use(bodyParser.json())
app.use('/', router)

let mongoURI = `mongodb+srv://chineseparrotlet:${mongoPassword}@viopecluster0.ryzbt.mongodb.net/viopedb?retryWrites=true&w=majority&appName=ViopeCluster0`
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log("Failed to connect to MongoDB", err))


app.listen(port, () => {
    console.log(`Listening port ${port}`)
})
