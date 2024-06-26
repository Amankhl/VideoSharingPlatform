// require('dotenv').config({path: './env'})
import dotenv from "dotenv"; // src/index.js is the main file so we don't need to import dotenv in other files
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

// whenever a async method is completed, it returns a promise. So our connectDB function was an async function that's why we can use .then().catch to handle the promise
connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERROR: ", error) //because sometimes the express app is not able to talk to DB so we add an event listener
        throw error
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at : ${process.env.PORT} `)
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed!!!", err)
})


























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
            console.log("ERROR: ", error) //because sometimes the express app is not able to talk to DB so we add an event listener
            throw error
        })
        app.listen(process.env.PORT, ()=>{
            console.log("App is listening on port:", process.env.PORT)
        })
    } catch (error) {
        console.log("ERROR: ",error)
        throw error
    }
})()
*/