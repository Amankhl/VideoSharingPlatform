// the purpose of the asyncHandler function is to reduce the redundancy of the same async-await and try-catch block for every function, now we can just use this function and pass functions in it and this will execute the same code.
// asyncHandler is an higher order function - functions that takes a function as its parameter and returns a function

// using promises
// const asyncHandler = (fn) => {() => {}} // the inner function within the curly brackets is of the function that is passed as a parameter.


const asyncHandler = (requestHandler) =>{
    (req,res,next)=>{
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
*/