const mongoose = require("mongoose")

const ApplicationSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  guarantor1: {
    name: String,
    email: String,
    location: String,
    cnic: String,
  },
  guarantor2: {
    name: String,
    email: String,
    location: String,
    cnic: String,
  },
  personalInfo: {
    address: String,
    phoneNumber: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  appointmentDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Application", ApplicationSchema)

