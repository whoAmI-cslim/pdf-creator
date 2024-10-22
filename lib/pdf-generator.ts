import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { FinancialData } from './excel-processor';

export async function generatePDF(data: FinancialData[], headers: string[], filename: string) {
  // Create PDF in landscape if we have many columns
  const isLandscape = headers.length > 8;
  const doc = new jsPDF(isLandscape ? 'landscape' : 'portrait');
  
  // Get page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const availableWidth = pageWidth - (margin * 2);
  
  // Calculate optimal font sizes based on page size
  const titleFontSize = Math.min(24, pageWidth / 20);
  const normalFontSize = Math.min(12, pageWidth / 45);
  const tableFontSize = Math.min(10, pageWidth / 50);
  
  // Add title with dynamic positioning
  doc.setFontSize(titleFontSize);
  const titleText = 'Financial Report';
  const titleWidth = doc.getTextWidth(titleText);
  doc.text(titleText, (pageWidth - titleWidth) / 2, margin);
  
  // Add metadata with appropriate spacing
  doc.setFontSize(normalFontSize);
  const timestamp = `Generated on: ${new Date().toLocaleString()}`;
  const recordCount = `Total Records: ${data.length}`;
  doc.text(timestamp, margin, margin * 2);
  doc.text(recordCount, margin, margin * 2.5);

  // Add financial summary first if we have numeric columns
  const numericColumns = headers.filter(header => {
    return data.some(row => !isNaN(parseFloat(row[header])));
  });

  let currentY = margin * 3;

  if (numericColumns.length > 0) {
    doc.setFontSize(titleFontSize * 0.7);
    doc.text('Financial Summary', margin, currentY);
    currentY += margin / 2;

    const summaryData = numericColumns.map(header => {
      const values = data.map(row => parseFloat(row[header]) || 0);
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);

      return [
        header,
        sum.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        avg.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        max.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        min.toLocaleString('en-US', { maximumFractionDigits: 2 })
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['Column', 'Sum', 'Average', 'Maximum', 'Minimum']],
      body: summaryData,
      styles: {
        fontSize: tableFontSize,
        cellPadding: 2,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [66, 66, 66],
        fontSize: tableFontSize,
        fontStyle: 'bold',
        halign: 'center',
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
      },
      margin: { top: margin, right: margin, bottom: margin, left: margin },
      tableWidth: pageWidth - (margin * 2),
    });

    currentY = (doc as any).lastAutoTable.finalY + margin;
  }

  // Start main data table on new page
  doc.addPage();

  // Calculate column widths proportionally
  const getContentWidth = (header: string) => {
    const headerWidth = doc.getTextWidth(header);
    const contentWidths = data.map(row => 
      doc.getTextWidth(String(row[header] || ''))
    );
    return Math.max(headerWidth, ...contentWidths);
  };

  const rawColumnWidths = headers.map(getContentWidth);
  const totalContentWidth = rawColumnWidths.reduce((sum, width) => sum + width, 0);
  const scaleFactor = Math.min(1, availableWidth / (totalContentWidth + (headers.length * 6)));
  const columnWidths = rawColumnWidths.map(width => (width + 6) * scaleFactor);

  // Create main data table
  autoTable(doc, {
    startY: margin,
    head: [headers],
    body: data.map(row => headers.map(header => row[header]?.toString() || '')),
    styles: {
      fontSize: tableFontSize,
      cellPadding: 2,
      overflow: 'linebreak',
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [66, 66, 66],
      fontSize: tableFontSize,
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: headers.reduce((acc, _, index) => {
      const isNumeric = data.some(row => !isNaN(parseFloat(row[headers[index]])));
      acc[index] = {
        cellWidth: columnWidths[index],
        halign: isNumeric ? 'right' : 'left'
      };
      return acc;
    }, {} as { [key: number]: any }),
    didDrawPage: (data) => {
      // Add page numbers
      const pageNumber = `Page ${data.pageNumber} of ${doc.getNumberOfPages()}`;
      doc.setFontSize(normalFontSize);
      doc.text(
        pageNumber,
        pageWidth - margin - doc.getTextWidth(pageNumber),
        pageHeight - margin
      );
    },
    margin: { top: margin, right: margin, bottom: margin, left: margin },
    tableWidth: pageWidth - (margin * 2),
  });

  // Save the PDF with custom filename
  doc.save(`${filename}.pdf`);
}