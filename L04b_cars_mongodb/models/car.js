// car.js
// 19th august 2024

import mongoose from 'mongoose'
const { Schema } = mongoose;

// schema defines the structure of document inside MongoDB
const carSchema = new Schema({
    // brand, model, color, year
    brand: {type: String, required: true, maxlength: 100},
    model: {type: String, required: true, maxlength: 100},
    color: {type: String, required: true, maxlength: 100},
    year: {type: Number, required: true}
})

// model is a function, that returns a class, that offers methods to create, read, update and delete
// model is based on schema, thats why it receives first parameter to datatable name, then to schema
export default mongoose.model('cars', carSchema)