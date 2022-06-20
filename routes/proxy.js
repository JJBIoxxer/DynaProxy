const express = require("express")
const axios = require("axios")

const Response = require("../classes/Response")
const HttpError = require("../classes/HttpError")
const AllowedMethods = require("../config/AllowedMethods.json")

const router = express.Router()

const authenticator = (req, res, next) => {
    const authToken = req.headers["proxy_auth_token"]
    if (authToken != process.env.PROXY_AUTH_TOKEN) {
        return res.status(403).send("403 | Not Authorized")
    }
}

const requestHandler = async (req, res, next) => {
    const { method } = req, request = req.body

    if (!AllowedMethods.includes(method)) {
        next( new HttpError("Method Not Allowed", 405) )
    }
    
    try {
        axios({
            url: request.url,
            method: method.toLowerCase(),
            headers: request.headers,
            body: request.body
        })
        .then(response => {
            res.response = response
            next()
        })
        .catch(err => {
            res.response = err.response
            next()
        })
    } catch (err) {
        next( new HttpError(err.message, 500) )
    }
}

const responseHandler = (req, res, next) =>{
    const { response } = res
    res.status(response.status).json({
        status: {
            code: response.status,
            message: response.statusText
        },
        headers: response.headers,
        body: response.data
    })
}

router.use(authenticator, requestHandler, responseHandler)

module.exports = router