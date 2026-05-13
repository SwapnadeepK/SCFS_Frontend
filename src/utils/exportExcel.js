import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Report");

  const file = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  saveAs(new Blob([file]), "report.xlsx");
};