// the purpose of the asyncHandler function is to reduce the redundancy of the same async-await and try-catch block for every function, now we can just use this function and pass functions in it and this will execute the same code.
// asyncHandler is an higher order function - functions that takes a function as its parameter and returns a function

// using promises
// const asyncHandler = (fn) => {() => {}} // the inner function within the curly brackets is of the function that is passed as a parameter.


const asyncHandler = (requestHandler) =>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}
export {asyncHandler}





/*
// using try-catch

// const asyncHandler = () =>{}
// const asyncHandler = (fn) => {async() => {}}
// const asyncHandler = (fn) => async() => {}

const asyncHandler = (fn) => async (req,res,next) => {
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}
   





If requestHandler is an async function, it already returns a Promise if no value is returned. And if a function within the Promise.reslove is synchronous function, they returns undefined if no value is returned.
Promise.resolve() effectively just returns the same Promise if that function is async, also executes that function within and returns a promise.

If requestHandler is an async function, it always returns a promise. If the async function doesn't explicitly return a value, the promise resolves with undefined. and when this function is called in Promis.resolve(), it returns the same promise.
When a synchronous function is called within Promise.resolve(), it also returns undefined if no value is returned.
Promise.resolve() effectively wraps the result of a synchronous function in a resolved promise, and if the function is async, Promise.resolve() just returns the same promise that the async function returns while ensuring that the function is executed.

Like this:

async function asyncFunction() {
    // No explicit return
}

const promise = asyncFunction();
console.log(promise); // Promise { <resolved>: undefined }

- But since we don't have to return the value of the resolved promise (undefined), we just call the resolved function in Promise.resolve() which executes its operation.


const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};
export { asyncHandler };

const asyncHandlerFunction = async (req, res, next) => {
    const data = await someAsyncOperation();
    res.json(data);
};

app.get('/async', asyncHandler(asyncHandlerFunction));

- Promise.resolve(asyncHandlerFunction(req, res, next)) executes asyncHandlerFunction, which returns a promise as it is also a async function.
- If someAsyncOperation() resolves successfully, the response is sent, and the promise resolves.
- If someAsyncOperation() rejects, the promise is rejected, and .catch catches the error and passes it to next(err).

Execution Flow:

- When a request hits the /async endpoint, asyncHandlerFunction is called.
Inside asyncHandlerFunction, await someAsyncOperation() pauses execution until someAsyncOperation completes and resolves its promise.
Promise Returned by asyncHandlerFunction:

- asyncHandlerFunction returns a promise that resolves with the result of res.json(data).
If someAsyncOperation() resolves successfully, res.json(data) will be executed, and the promise returned by asyncHandlerFunction will resolve with undefined (since res.json() doesn't return a value).
Handling with asyncHandler:

- asyncHandler(asyncHandlerFunction) wraps asyncHandlerFunction and ensures any errors thrown inside it are caught and passed to Express's error-handling middleware.

# Example of how to use asyncHandler and why we use next() in the catch block:

import express from 'express';
import { asyncHandler } from './asyncHandler';

const app = express();

//controller
const getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new Error('User not found');
    }
    res.json(user);
};

// Route handling
app.get('/user/:id', asyncHandler(getUser));


// Error-handling middleware if error is thrown in the asyncHandler, that error is passed to this middleware using next(err)
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});












*/