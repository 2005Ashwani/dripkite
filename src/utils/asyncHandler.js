const asyncHandler = (fun) => async (req, res, next) => {

    try {

        await fun(req, res, next)
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
            success: false
        })
    }

}

export default asyncHandler