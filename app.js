if (process.env.NODE_ENV != "production") require("dotenv").config()

const express = require("express")

const proxyRouter = require("./routes/proxy")
const errorHandler = require("./middlewares/ErrorHandler")

const app = express()

app.use(express.json())

app.use("/", proxyRouter)
app.use(errorHandler)

const port = process.env.PORT || 5462
app.listen(port, () => console.log(`App started on port ${port}...`))