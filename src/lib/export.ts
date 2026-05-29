import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Exports data to an Excel file.
 * @param data Array of objects to export
 * @param filename Name of the file (without extension)
 */
export const exportToExcel = (data: any[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Exports a summary report to PDF.
 * @param title Title of the report
 * @param metrics Key-value pairs for the summary
 * @param tableData Data for a detailed table
 * @param filename Name of the file (without extension)
 */
export const exportToPDF = (
  title: string, 
  metrics: { label: string, value: string | number }[], 
  tableData: any[], 
  filename: string
) => {
  const doc = new jsPDF() as any;
  const timestamp = new Date().toLocaleString();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(147, 51, 234); // Brand Purple
  doc.text('Smartovate', 14, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text(title, 14, 32);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text(`Généré le: ${timestamp}`, 14, 40);

  // Summary Metrics Section
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('Résumé des KPIs', 14, 55);
  doc.line(14, 57, 196, 57);

  let yPos = 65;
  metrics.forEach(m => {
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(m.label, 14, yPos);
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(String(m.value), 80, yPos);
    yPos += 8;
  });

  // Table Section
  if (tableData && tableData.length > 0) {
    const headers = Object.keys(tableData[0]);
    const rows = tableData.map(obj => headers.map(key => obj[key]));

    (doc as any).autoTable({
      startY: yPos + 10,
      head: [headers.map(h => h.toUpperCase())],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [147, 51, 234], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 8 }
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Smartovate Analytics - Page ${i} sur ${pageCount}`, 14, doc.internal.pageSize.height - 10);
  }

  doc.save(`${filename}.pdf`);
};
