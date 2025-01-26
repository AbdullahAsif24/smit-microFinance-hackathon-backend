const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const sendPasswordEmail = async (email, tempPassword) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Temporary Password - Saylani Microfinance",
      html: `
        <h1>Welcome to Saylani Microfinance</h1>
        <p>Your temporary password is: <strong>${tempPassword}</strong></p>
        <p>Please log in and change your password immediately for security purposes.</p>
        <p>Best regards,<br>Saylani Microfinance Team</p>
      `,
    })
    return true
  } catch (error) {
    console.error("Email sending error:", error)
    return false
  }
}

module.exports = { sendPasswordEmail }

