const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")
const User = require("../models/User")
const auth = require("../middleware/auth")
// const { sendPasswordEmail } = require("../utils/emailService")
const crypto = require("crypto")

// Generate random temporary password
const generateTempPassword = () => {
  return crypto.randomBytes(4).toString("hex")
}

// @route   POST api/auth/register
// @desc    Register a user and send temporary password
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("cnic", "CNIC is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, cnic } = req.body

    try {
      let user = await User.findOne({
        $or: [{ email }, { cnic }],
      })

      if (user) {
        return res.status(400).json({ msg: "User already exists with this email or CNIC" })
      }

      // Generate temporary password
      const tempPassword = generateTempPassword()

      user = new User({
        name,
        email,
        cnic,
        password: tempPassword,
        requirePasswordChange: true,
      })

      // Hash the temporary password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(tempPassword, salt)

      await user.save()


      res.json({ msg: "Registration successful. Please check your email for login credentials." })
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server error")
    }
  },
)

// Other routes remain the same...

module.exports = router

