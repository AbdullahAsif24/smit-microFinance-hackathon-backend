require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

const app = express()

// Connect Database
connectDB()

// Init Middleware
app.use(express.json({ extended: false }))
app.use(cors("*"))

// Define Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/loans", require("./routes/loans"))
app.use("/api/admin", require("./routes/admin"))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

