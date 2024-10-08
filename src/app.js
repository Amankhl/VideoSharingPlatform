import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

// app.use for middlewares and config settings
// cors is to allow the cross orgigin requests from cross origin we specify
app.use(cors({
    origin: process.env.CROSS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"})) // another middleware to handle the json limit
app.use(express.urlencoded({extended: true, limit:"16kb"}))  // extended for allowing objects in objects
app.use(express.static("public")) // if some files like pdf, images, favicon are upload, we store them in public folder
app.use(cookieParser()) // to perform crud operations on cookies of users on users' browser






// Routes import
import userRouter from "./routes/user.routes.js"   // we can use any name as long as they are 'export default'


// Routes declaration
app.use("/api/v1/users", userRouter)    // we usually use .get('/route', (req, res) => {}) (route + controller) together, but here we seperated route and controller

// http://localhost:3000/api/v1/users/register  OR for example http://localhost:3000/api/v1/users/login
// if a user comes to this url, they will be redirected to userRouter (user.routes.js) and userRouter will handle the request by calling the controller registerUser (user.controller.js)

export { app }



















/*
1. Parsing Cookies: When a client (e.g., a web browser) sends an HTTP request to your server, it may include cookies as part
of the request headers. These cookies contain information that the server can use to track user sessions, personalize content, etc.

2. Middleware Function: `app.use(cookieParser())` is a crucial middleware function provided by the cookie-parser package in Express.js. This function parses
cookies from the request headers and populates (extracting data coming from HTTP request) `req.cookies` with an object containing key-value pairs of cookie names
and their corresponding values.


Example code:

app.use(cookieParser());

app.get('/', (req, res) => {
    // Access cookies from req.cookies
    const username = req.cookies.username || 'Guest';
    res.send(`Hello, ${username}!`);

*/