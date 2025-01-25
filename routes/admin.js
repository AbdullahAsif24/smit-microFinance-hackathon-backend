const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const User = require("../models/User")
const Application = require("../models/Application")

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admin only." })
    }
    next()
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
}

// @route   GET api/admin/applications
// @desc    Get all loan applications
// @access  Private (Admin only)
router.get("/applications", [auth, isAdmin], async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("user", ["name", "email", "cnic"])
      .populate("loan")
      .sort({ createdAt: -1 })
    res.json(applications)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   PUT api/admin/applications/:id
// @desc    Update application status
// @access  Private (Admin only)
router.put("/applications/:id", [auth, isAdmin], async (req, res) => {
  const { status, appointmentDate } = req.body

  try {
    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({ msg: "Application not found" })
    }

    application.status = status
    if (appointmentDate) {
      application.appointmentDate = appointmentDate
    }

    await application.save()

    res.json(application)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router

