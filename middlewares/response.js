const statusMessages = require("../config/statusMessages.json")

module.exports = (req, res, next) => {
    const {
        statusCode = 200,
        statusMessage = statusMessages[statusCode],
        body = []
    } = res.locals

    const success = (statusCode >= 200 && statusCode <= 299)

    return res.status(statusCode).json({
        success: success,
        code: statusCode,
        message: statusMessage,
        body: body
    })
}