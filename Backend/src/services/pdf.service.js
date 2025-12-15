const PDFDocument = require("pdfkit");

exports.generateHallTicket = (student, exam) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Add content to PDF
    doc.fontSize(20).text("Hall Ticket", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Student Name: ${student.name}`);
    doc.text(`Roll Number: ${student.rollNumber}`);
    doc.text(`Exam: ${exam.title}`);
    doc.text(`Date: ${exam.date.toDateString()}`);
    doc.text(`Time: ${exam.time}`);
    doc.text(`Venue: ${exam.venue}`);

    doc.end();
  });
};

exports.generateSeatingArrangement = (seating) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Add content to PDF
    doc.fontSize(20).text("Seating Arrangement", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Exam: ${seating.exam.title}`);
    doc.text(`Hall: ${seating.hall}`);
    doc.moveDown();

    seating.arrangements.forEach((arrangement) => {
      doc.text(
        `Seat ${arrangement.seatNumber}: ${arrangement.student.name} (${arrangement.student.rollNumber})`
      );
    });

    doc.end();
  });
};
