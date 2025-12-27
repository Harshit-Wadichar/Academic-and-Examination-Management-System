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
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      let buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      doc.on("error", reject);

      // --- COLORS ---
      const primaryColor = "#4F46E5"; // Indigo-600
      const secondaryColor = "#1F2937"; // Gray-800
      const accentColor = "#6B7280"; // Gray-500
      const lightBg = "#F3F4F6"; // Gray-100
      const tableHeaderBg = "#374151"; // Gray-700

      // --- HEADER ---
      // Top colored bar
      doc.rect(0, 0, doc.page.width, 100).fill(primaryColor);
      
      // Title
      doc.fillColor("white")
         .fontSize(28)
         .font("Helvetica-Bold")
         .text("Seating Arrangement", 50, 35);
      
      // Generated Date
      doc.fontSize(10)
         .font("Helvetica")
         .text(`Generated: ${new Date().toLocaleString()}`, 50, 75);

      // Reset text color
      doc.fillColor("black");

      let yPos = 130;

      // --- INFO CARDS ---
      // Two column layout
      const colWidth = (doc.page.width - 100 - 20) / 2;
      
      // Exam Info Card (Left)
      doc.roundedRect(50, yPos, colWidth, 100, 5).fillAndStroke(lightBg, "#E5E7EB");
      doc.fillColor(primaryColor).fontSize(14).font("Helvetica-Bold").text("Exam Details", 65, yPos + 15);
      
      doc.fillColor(secondaryColor).fontSize(10).font("Helvetica-Bold");
      doc.text("Title:", 65, yPos + 40);
      doc.text("Course:", 65, yPos + 55);
      doc.text("Date:", 65, yPos + 70);
      
      doc.font("Helvetica").fillColor(secondaryColor);
      doc.text(seating.exam?.title || "N/A", 115, yPos + 40);
      doc.text(seating.exam?.course || "N/A", 115, yPos + 55);
      doc.text(seating.exam?.date ? new Date(seating.exam.date).toLocaleDateString() : "N/A", 115, yPos + 70);

      // Hall Info Card (Right)
      const rightColX = 50 + colWidth + 20;
      doc.roundedRect(rightColX, yPos, colWidth, 100, 5).fillAndStroke(lightBg, "#E5E7EB");
      doc.fillColor(primaryColor).fontSize(14).font("Helvetica-Bold").text("Hall Details", rightColX + 15, yPos + 15);

      const hallName = typeof seating.hall === 'object' ? seating.hall?.name : seating.hall;
      const hallCapacity = typeof seating.hall === 'object' ? seating.hall?.capacity : "N/A";

      doc.fillColor(secondaryColor).fontSize(10).font("Helvetica-Bold");
      doc.text("Name:", rightColX + 15, yPos + 40);
      doc.text("Capacity:", rightColX + 15, yPos + 55);
      doc.text("Total Students:", rightColX + 15, yPos + 70);

      doc.font("Helvetica").fillColor(secondaryColor);
      doc.text(hallName || "N/A", rightColX + 100, yPos + 40);
      doc.text(String(hallCapacity), rightColX + 100, yPos + 55);
      doc.text(String(seating.arrangements?.length || 0), rightColX + 100, yPos + 70);

      yPos += 130;

      // --- TABLE ---
      doc.fontSize(16).font("Helvetica-Bold").fillColor(secondaryColor).text("Student Assignments", 50, yPos);
      yPos += 30;

      // Draw Table Header
      const tableHeaders = [
        { label: "Seat", x: 50, w: 50 },
        { label: "Roll No.", x: 100, w: 80 },
        { label: "Student Name", x: 180, w: 150 },
        { label: "Class/Course", x: 330, w: 100 },
        { label: "Row", x: 440, w: 40 },
        { label: "Col", x: 480, w: 40 }
      ];

      // Header Background
      doc.rect(50, yPos, doc.page.width - 100, 25).fill(tableHeaderBg);
      
      // Header Text
      doc.fillColor("white").fontSize(10).font("Helvetica-Bold");
      tableHeaders.forEach(header => {
        doc.text(header.label, header.x + 5, yPos + 8, { width: header.w, ellipsis: true });
      });

      yPos += 25;

      // Rows
      doc.font("Helvetica").fontSize(10);
      
      if (seating.arrangements && seating.arrangements.length > 0) {
        seating.arrangements.forEach((arrangement, index) => {
          // Check for new page
          if (yPos > doc.page.height - 50) {
            doc.addPage();
            yPos = 50;
            // Re-draw Header on new page
             doc.rect(50, yPos, doc.page.width - 100, 25).fill(tableHeaderBg);
             doc.fillColor("white").font("Helvetica-Bold");
             tableHeaders.forEach(header => {
               doc.text(header.label, header.x + 5, yPos + 8, { width: header.w, ellipsis: true });
             });
             yPos += 25;
             doc.font("Helvetica");
          }

          // Zebra Striping
          if (index % 2 === 0) {
            doc.rect(50, yPos, doc.page.width - 100, 20).fill(lightBg);
          } else {
             // ensure white background implies resetting fill color if strictly needed, but rect does it
          }

          doc.fillColor(secondaryColor);
          
          const studentName = arrangement.studentName || arrangement.student?.name || "N/A";
          const rollNumber = arrangement.studentRollNumber || arrangement.student?.rollNumber || arrangement.student?.email || "N/A";
          const classInfo = arrangement.class || "N/A";

          // Cell Text
          // We add +5 padding to x, +5 to y
          doc.text(arrangement.seatNumber || "-", 55, yPos + 5, { width: 45 });
          doc.text(rollNumber, 105, yPos + 5, { width: 75 });
          doc.text(studentName, 185, yPos + 5, { width: 145, ellipsis: true });
          doc.text(classInfo, 335, yPos + 5, { width: 95, ellipsis: true });
          doc.text(String(arrangement.row || "-"), 445, yPos + 5);
          doc.text(String(arrangement.column || "-"), 485, yPos + 5);
          
          yPos += 20;
        });
      } else {
        doc.fillColor(secondaryColor).text("No arrangements found.", 55, yPos + 10);
      }

      // Footer Page Numbers
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).fillColor(accentColor).text(
          `Page ${i + 1} of ${range.count}`,
          0,
          doc.page.height - 30,
          { align: "center", width: doc.page.width }
        );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
