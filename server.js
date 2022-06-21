const express = require("express")
const axios = require("axios")

const HttpError = require("./classes/HttpError")

const allowedMethods = require("./config/allowedMethods.json")

const errorHandler = require("./middlewares/ErrorHandler")
const responseHandler = require("./middlewares/response")

const app = express()

app.use(express.json())

app.use("/", (req, res, next) => {
    const token = req.headers.proxy_auth_token

    if (!token) next( new HttpError("The 'proxy_auth_token' header is missing.", 400) )

    if (token != process.env.PROXY_AUTH_TOKEN) next( new HttpError("Invalid 'proxy_auth_token' was provided.", 401) )

    next()
}, (req, res, next) => {
    const { method } = req, request = req.body

    if (!allowedMethods.includes(method)) next( new HttpError(`The following are the only allowed methods. [${allowedMethods.join(", ")}]`, 405) )

    try {
        axios({
            url: request.url,
            method: method.toLowerCase(),
            headers: request.headers,
            body: request.body
        })
        .then(response => {
            res.locals.response = response
            next()
        })
        .catch(err => {
            res.locals.response = err.response
            next()
        })
    } catch (err) {
        next( new HttpError(err.message, 500) )
    }
}, (req, res, next) => {
    const { response } = res.locals

    res.locals = {
        statusCode: response.status,
        body: response.data
    }

    next()
})

app.use(errorHandler)
app.use(responseHandler)

const port = process.env.PORT || 5462
app.listen(port, () => console.log(`Server started on port ${port}...`))