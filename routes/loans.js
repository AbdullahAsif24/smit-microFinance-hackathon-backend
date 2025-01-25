const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const Loan = require("../models/Loan")
const Application = require("../models/Application")

// @route   POST api/loans
// @desc    Apply for a loan
// @access  Private
router.post("/", auth, async (req, res) => {
  const { category, subcategory, amount, period } = req.body

  try {
    const newLoan = new Loan({
      category,
      subcategory,
      amount,
      period,
      user: req.user.id,
    })

    const loan = await newLoan.save()

    res.json(loan)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   POST api/loans/application
// @desc    Submit loan application
// @access  Private
router.post("/application", auth, async (req, res) => {
  const { loanId, guarantor1, guarantor2, personalInfo } = req.body

  try {
    const loan = await Loan.findById(loanId)

    if (!loan) {
      return res.status(404).json({ msg: "Loan not found" })
    }

    if (loan.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" })
    }

    const newApplication = new Application({
      loan: loanId,
      user: req.user.id,
      guarantor1,
      guarantor2,
      personalInfo,
    })

    const application = await newApplication.save()

    res.json(application)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   GET api/loans
// @desc    Get all loans for a user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id }).sort({ date: -1 })
    res.json(loans)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router

