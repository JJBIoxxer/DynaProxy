module.exports = (err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        error: {
            message: err.message,
            stack: err.stack
        }
    })
}