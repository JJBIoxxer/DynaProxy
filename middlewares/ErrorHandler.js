module.exports = (err, req, res, next) => {
    res.locals.statusCode = err.statusCode,
    res.locals.body = {
        error: err.message
    }
    next()
}