// require('dotenv').config({path: './env'})
import dotenv from 'dotenv' // src/index.js is the main file so we don't need to import dotenv in other files
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDB()


























/*
// 1st way to connect to db, but this pollutes the index file

import express from 'express'
const app = express()

function connectDB(){}
connectDB()
// OR
// you can use IIFE (Immediately Invoked Function Expression)
;( async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR: ", error)
            throw error
        }) //because sometimes the express app is not able to talk to DB so we add an event listener
        app.listen(process.env.PORT, ()=>{
            console.log("App is listening on port:", process.env.PORT)
        })
    } catch (error) {
        console.log("ERROR: ",error)
        throw error
    }
})()
*/