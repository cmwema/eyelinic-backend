const fs = require("fs");
const PDFDocument = require("pdfkit");

function createReceipt(receipt, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, receipt);
  generateReceiptTable(doc, receipt);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc
    .image("/public/img/logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Eyelinic.", 110, 57)
    .fontSize(10)
    .text("Eyelinic.", 200, 50, { align: "right" })
    .text("123 Nowhere Street", 200, 65, { align: "right" })
    .text("Nairobi", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, receipt) {
  doc.fillColor("#444444").fontSize(20).text("receipt", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("receipt Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(receipt._id, 150, customerInformationTop)
    .font("Helvetica")
    .text("receipt Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .moveDown();

  generateHr(doc, 252);
}

function generateReceiptTable(doc, receipt) {
  let i;
  const receiptTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    receiptTableTop,
    "Mpesa Receipt Number",
    "Phone Number",
    "Date",
    "Time",
    "Service",
    "Amount"
  );
  generateHr(doc, receiptTableTop + 20);
  doc.font("Helvetica");

  const position = receiptTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    position,
    receipt.MpesaReceiptNumber,
    receipt.PhoneNumber,
    appointment.toDateString(),
    appointment.toTimeString(),
    receipt.service.name,
    formatCurrency(receipt.price)
  );
  generateHr(doc, position + 20);
}

function generateFooter(doc) {
  doc.fontSize(10).text("Thank you for booking our Service.", 50, 780, {
    align: "center",
    width: 500,
  });
}

function generateTableRow(
  doc,
  y,
  MpesaReceiptNumber,
  PhoneNumber,
  appointmentDate,
  appointmentTime,
  service,
  amount
) {
  doc
    .fontSize(10)
    .text(MpesaReceiptNumber, 50, y)
    .text(PhoneNumber, 150, y)
    .text(appointmentDate, 280, y, { width: 90, align: "right" })
    .text(appointmentTime, 370, y, { width: 90, align: "right" })
    .text(service, 370, y, { width: 90, align: "right" })
    .text(amount, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(price) {
  return "Ksh" + price;
}

module.exports = {
  createReceipt,
};
