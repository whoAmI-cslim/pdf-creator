import * as XLSX from 'xlsx';

export interface FinancialData {
  [key: string]: any;
}

export async function processExcel(file: File): Promise<{
  headers: string[];
  data: FinancialData[];
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON with headers
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          raw: false,
          dateNF: 'yyyy-mm-dd',
          defval: '' // Default value for empty cells
        });

        // Extract headers from the first row
        const headers = Object.keys(jsonData[0] || {});
        
        resolve({
          headers,
          data: jsonData as FinancialData[]
        });
      } catch (error) {
        console.error('Error processing Excel:', error);
        reject(new Error('Failed to process Excel file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
}