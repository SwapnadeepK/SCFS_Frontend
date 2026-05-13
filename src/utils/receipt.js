import jsPDF from "jspdf";

export const generateReceipt = (payment) => {
  const doc = new jsPDF();

  doc.text("VTU College Fee Receipt", 20, 20);
  doc.text(`Student: ${payment.studentName}`, 20, 40);
  doc.text(`Amount: ${payment.amount}`, 20, 50);
  doc.text(`Date: ${payment.date}`, 20, 60);

  doc.save("receipt.pdf");
};