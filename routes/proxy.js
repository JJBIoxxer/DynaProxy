const express = require("express")
const axios = require("axios")

const HttpError = require("../classes/HttpError")
const ALLOWED_METHODS = require("../config/AllowedMethods.json")

const router = express.Router()

router.use(async (req, res, next) => {
    if (!ALLOWED_METHODS.includes(req.method)) {
        next( new HttpError("Method Not Allowed", 405) )
    }

    const request = req.body

    try {
        axios({
            url: request.url,
            method: req.method.toLowerCase(),
            headers: request.headers,
            body: request.body
        }).then(response => {
            return res.send(response.data)
        })
    } catch (err) {
        next( new HttpError(err.message, 500) )
    }
})

module.exports = router