const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

exports.sendHallTicket = async (studentEmail, hallTicketPdf) => {
  // TODO: Implement sending hall ticket PDF as attachment
  await this.sendEmail(
    studentEmail,
    "Your Hall Ticket",
    "Please find your hall ticket attached.",
    "<p>Please find your hall ticket attached.</p>"
  );
};

exports.sendExamNotification = async (studentEmails, exam) => {
  const subject = `Exam Notification: ${exam.title}`;
  const text = `Dear Student,\n\nYou have an upcoming exam: ${exam.title} on ${exam.date}.\n\nBest regards,\nAcademic Management System`;

  for (const email of studentEmails) {
    await this.sendEmail(email, subject, text);
  }
};
