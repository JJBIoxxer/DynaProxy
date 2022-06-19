const express = require("express")

const proxyRouter = require("./routes/proxy")
const errorHandler = require("./middlewares/ErrorHandler")

const app = express()

app.use(express.json())

app.use("/proxy", proxyRouter)
app.use(errorHandler)

const PORT = 5462
app.listen(PORT, () => console.log(`App started on port ${PORT}...`))