import * as XLSX from 'xlsx';

export interface FinancialData {
  date: string;
  description: string;
  amount: number;
  category: string;
}

export async function processExcel(file: File): Promise<FinancialData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Assume first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Transform and validate data
        const financialData: FinancialData[] = jsonData.map((row: any) => ({
          date: row.date || row.Date || '',
          description: row.description || row.Description || '',
          amount: parseFloat(row.amount || row.Amount || 0),
          category: row.category || row.Category || 'Uncategorized',
        }));

        resolve(financialData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
}