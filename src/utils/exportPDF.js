import jsPDF from "jspdf";

export const exportToPDF = (data) => {
  const doc = new jsPDF();

  data.forEach((row, i) => {
    doc.text(`${row.studentName} - ${row.amount}`, 10, 10 + i * 10);
  });

  doc.save("report.pdf");
};