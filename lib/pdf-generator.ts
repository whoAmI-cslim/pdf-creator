import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { FinancialData } from './excel-processor';

export async function generatePDF(data: FinancialData[]) {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text('Financial Report', 14, 15);

  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

  // Calculate totals
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  
  // Add summary
  doc.setFontSize(12);
  doc.text(`Total Transactions: ${data.length}`, 14, 35);
  doc.text(`Total Amount: $${total.toFixed(2)}`, 14, 42);

  // Create table
  autoTable(doc, {
    startY: 50,
    head: [['Date', 'Description', 'Category', 'Amount']],
    body: data.map(item => [
      item.date,
      item.description,
      item.category,
      `$${item.amount.toFixed(2)}`
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [66, 66, 66],
    },
  });

  // Add category summary
  const categories = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryStartY = doc.lastAutoTable?.finalY || 50;
  
  doc.setFontSize(14);
  doc.text('Category Summary', 14, categoryStartY + 15);

  autoTable(doc, {
    startY: categoryStartY + 20,
    head: [['Category', 'Total Amount']],
    body: Object.entries(categories).map(([category, amount]) => [
      category,
      `$${amount.toFixed(2)}`
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [66, 66, 66],
    },
  });

  // Save the PDF
  doc.save('financial-report.pdf');
}