

const errorHandler = (err, req, res, next) => {
    console.log("Error handler Runs ", err)
     if (err.code === 11000) { 
            return res.status(409).json({
                success: false,
                message: "A user with this email already exists."
            });
        }
        console.error("error message ",err.message)
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred. Please try again later."
        })
}

export default errorHandler

// even i dont define the error handler and return next(err) i was still receiving the exact error on frontened
// how can next(err) could find the errorHandler function since we aren't specifically running it