class ApiError extends Error {
    constructor(statusCode, message="Something went wrong", errors=[], stack=""){
        super(message);  //Error constructor - Error(message)
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false; // we are handling errors not response, so we don't need success message
        this.errors = errors;

        if (stack) {// when stack is provided
            this.stack = stack 
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
        // if no stack is provided, Error.captureStackTrace is called to generate a stack trace for the current point in the code where the error is instantiated.
        // This method is used to create a '.stack' property on the error instance which contains a string representation of the point in the code at which the Error was instantiated.
        // 'this' refers to the current instance of 'ApiError', meaning trace will show where the error actually occurred in your code.
        // 'this.constructor' tells captureStackTrace to exclude the current constructor (ApiError) from the stack trace, which can make the stack trace more readable by showing where the error actually occurred in your application code, rather than showing the internal details about the ApiError constructor itself.
        // This is useful for debugging purposes. 
    }
}

export {ApiError}

//The Error class is a built-in object that represents an error. It is used to throw custom errors and handle exceptions in a standardized way









/*
Example code: what we can do with ApiError 


app.use(express.json());

// Route Handler for /error endpoint. Just to use ApiError for testing
app.get('/error', (req, res, next) => {
    try {
        // Simulate an error
        throw new ApiError(404, "Resource not found");
    } catch (error) {   // catches the above error
        next(error);   // this next is now pass control to the next middleware (Error Handling Middleware) and sends the error to Error Handling Middleware
    }
});

// General Error Handling Middleware
app.use((err, req, res, next) => {          // fetches the above error 
    if (err instanceof ApiError) {          // checks if the err that has been fetched is an instance of ApiError
        res.status(err.statusCode).json({   // sends response in json with properties containing values of err (object of ApiError) properties 
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: err.data
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

1. Instantiation:
When throw new ApiError(404, "Resource not found") is executed inside app.get, the ApiError constructor is called.

2. Stack Trace Capture:
Inside the ApiError constructor, Error.captureStackTrace(this, this.constructor) is called.
this refers to the current ApiError instance.
this.constructor refers to the ApiError function itself.

3. Exclusion:
The captureStackTrace method captures the stack trace but excludes the ApiError constructor from the trace.

#If Error.captureStackTrace did not exclude the ApiError constructor, the stack trace would include the frames
related to the construction of the ApiError object itself. This would make the stack trace longer and include less relevant details


4. Output:
When you print error.stack, the stack trace does not include the ApiError constructor. Instead, it shows where new ApiError
was called (inside someFunction), making it easier to identify the actual location in your code that caused the error.



# Example Output

With Exclusion (Error.captureStackTrace(this, this.constructor`)):
ApiError: Resource not found
    at app.get('/error', ...) (/path/to/your/file.js:21:11)
    at Object.<anonymous> (/path/to/your/file.js:25:1)
    at Module._compile (internal/modules/cjs/loader.js:999:30)
    at Module._extensions..js (internal/modules/cjs/loader.js:1027:10)
    at Module.load (internal/modules/cjs/loader.js:863:32)
    at Function.Module._load (internal/modules/cjs/loader.js:708:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:60:12)
    at internal/main/run_main_module.js:17:47


Without Exclusion (Error.captureStackTrace(this)):
ApiError: Resource not found
    at new ApiError (/path/to/your/file.js:6:5)
    at app.get('/error', ...) (/path/to/your/file.js:21:11)
    at Object.<anonymous> (/path/to/your/file.js:25:1)
    ...














# In JavaScript, especially in ES6 (ECMAScript 2015) and later, you do not need to explicitly
declare instance variables at the beginning of a class as you might in some other programming
languages (like Java or C++). Instead, you can initialize these properties directly within the constructor.    


# No Need to explicitly declare instance variables:
class ApiError extends Error {
var statusCode;
var data;
var message;
var success;
var errors;
constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
...

*/