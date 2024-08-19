// routes.js
// 19th august 2024

// please note that carSchema model offers variety of methods to read, update, add or delete
// to add, create a new object out of model, and use that object's save() function
// to delete, do not create a new object, but use class function deleteOne()
// to update, do not create a new object, but use class function findOneAndUpdate()

import express from 'express'
import mongoose from 'mongoose'
import carSchema from './models/car.js'

const router = express.Router()


// GET ALL CARS
router.get('/cars', async (req, res) => {
    try {
        if (!mongoose.connection.readyState) {
            throw new Error('MongoDB connection is not established');
        }
        const data = await carSchema.find()
        return res.json(data)
    }
    catch(err) {
        res.status(500).json({message: err.message})
    }
})

// ADD NEW CAR
router.post('/cars', async (req, res) => {
    try {
        if (!mongoose.connection.readyState) {
            throw new Error('MongoDB connection is not established');
        }
        const newCar = new carSchema({
            brand: req.body.brand,
            model: req.body.model,
            color: req.body.color,
            year: req.body.year
        })
        await newCar.save()
        return res.status(201).json(newCar)
    }
    catch(err) {
        res.status(500).json({message: err.message})
    }
})


// DELETE CAR
router.delete('/cars', async (req, res) => {
    try {
        if (!mongoose.connection.readyState) {
            throw new Error('MongoDB connection is not established');
        }
        const id = req.body._id
        const result = await carSchema.deleteOne({_id: id})
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No car found with the given ID!" });
        }
        res.status(200).json({ message: "Car deleted successfully!" });
    }
    catch(err) {
        res.status(500).json({message: err.message})
    }
})

// UPDATE CAR
router.put('/cars/:id', async (req, res) => {
    try {
        if (!mongoose.connection.readyState) {
            throw new Error('MongoDB connection is not established');
        }
        const result = await carSchema.findOneAndUpdate(
            { _id: req.params.id }, 
            req.body,
            { new: true }
        )
        if (!result) {
            return res.status(404).json({message: "Car not found with the given ID!"})
        }
        res.status(200).json( {result} )
    }
    catch(err) {
        res.status(500).json({message: err.message})
    }
})

export default router