# Financial Report Generator

A modern web application that allows users to upload Excel sheets containing financial data, view and edit the data in a dynamic table, and generate professional PDF reports.

![Financial Report Generator](https://github.com/your-username/financial-report-generator/raw/main/public/preview.png)

## Features

- 📊 Excel File Upload & Processing
- 📝 Interactive Data Table with Inline Editing
- 🔍 Advanced Filtering with Smart Value Selection
- ↕️ Column Sorting
- 📑 Professional PDF Report Generation
- 🌓 Light/Dark Mode Support
- 📱 Responsive Design

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/financial-report-generator.git
cd financial-report-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Guide

### Uploading Excel Files

1. Click the "Select Excel File" button
2. Choose your Excel file (.xlsx or .xls)
3. Wait for the file to be processed

### Working with Data

#### Viewing Data
- All data is displayed in a scrollable table
- Use horizontal scroll if needed to view all columns
- The Actions column remains fixed on the left for easy access

#### Editing Data
1. Click the pencil icon (✏️) on any row to enter edit mode
2. Modify values directly in the cells
3. Click the checkmark (✓) to save changes

#### Adding/Deleting Rows
- Click "Add Row" to insert a new empty row
- Click the trash icon (🗑️) to delete a row

#### Filtering Data
1. Click "Add Filter" to create a new filter
2. Select:
   - Column to filter
   - Operator (contains, equals, etc.)
   - Value from the dropdown of existing values
3. Add multiple filters as needed
4. Remove filters using the X button

#### Sorting Data
- Click on any column header to sort
- Click again to reverse sort order
- Click a third time to remove sorting

### Generating PDF Reports

1. Enter a filename (optional - defaults to 'financial-report')
2. Click "Generate PDF"
3. The PDF will include:
   - Financial summary with calculations
   - Complete data table
   - Page numbers and metadata

## Project Structure

```
financial-report-generator/
├── app/                    # Next.js app directory
├── components/            # React components
├── lib/                   # Utility functions
│   ├── excel-processor.ts # Excel file handling
│   ├── pdf-generator.ts   # PDF generation
│   ├── filtering.ts       # Data filtering logic
│   └── sorting.ts         # Data sorting logic
└── public/               # Static assets
```

## Built With

- [Next.js](https://nextjs.org/) - React Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [XLSX](https://www.npmjs.com/package/xlsx) - Excel Processing
- [jsPDF](https://www.npmjs.com/package/jspdf) - PDF Generation
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

If you have any questions or need help, please open an issue in the GitHub repository.