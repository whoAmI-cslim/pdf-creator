"use client"

import { useState, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileSpreadsheet, Upload, Plus, Edit2, Trash2, ArrowUpDown } from 'lucide-react'
import { processExcel } from '@/lib/excel-processor'
import { generatePDF } from '@/lib/pdf-generator'
import { sortData, type SortConfig, type SortDirection } from '@/lib/sorting'
import { filterData, type FilterConfig } from '@/lib/filtering'
import { DataFilter } from '@/components/data-filter'

export function FileUpload() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [data, setData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [filename, setFilename] = useState('financial-report')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null })
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive"
      })
      return
    }

    try {
      setIsProcessing(true)
      setProgress(25)

      const result = await processExcel(file)
      setHeaders(result.headers)
      setData(result.data)
      setProgress(100)

      toast({
        title: "Success!",
        description: "Your file has been processed",
      })
    } catch (error) {
      console.error('Error processing file:', error)
      toast({
        title: "Error",
        description: "Failed to process the file. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleGeneratePDF = async () => {
    try {
      setIsProcessing(true)
      await generatePDF(data, headers, filename)
      toast({
        title: "Success!",
        description: "Your PDF report has been generated",
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const addRow = () => {
    const newRow = headers.reduce((acc, header) => ({ ...acc, [header]: '' }), {})
    setData([...data, newRow])
  }

  const deleteRow = (index: number) => {
    setData(data.filter((_, i) => i !== index))
    if (editingIndex === index) setEditingIndex(null)
  }

  const updateCell = (rowIndex: number, header: string, value: string) => {
    const newData = [...data]
    newData[rowIndex] = { ...newData[rowIndex], [header]: value }
    setData(newData)
  }

  const cancelEdit = () => setEditingIndex(null)

  const handleSort = (key: string) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  }

  // Apply sorting and filtering
  const filteredData = filters.length > 0 ? filterData(data, filters) : data;
  const sortedData = sortConfig.direction ? sortData(filteredData, sortConfig) : filteredData;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center">
          <FileSpreadsheet className="h-12 w-12 text-primary mb-4" />
          <div className="flex flex-col items-center">
            <Button
              className="mb-2"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isProcessing ? 'Processing...' : 'Select Excel File'}
            </Button>
            <p className="text-sm text-muted-foreground">
              Upload your financial Excel sheet
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={isProcessing}
          />

          {isProcessing && (
            <div className="w-full mt-6">
              <Progress value={progress} className="mb-2" />
              <p className="text-sm text-center text-muted-foreground">
                Processing your file...
              </p>
            </div>
          )}
        </div>
      </Card>

      {data.length > 0 && (
        <>
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  PDF Filename
                </label>
                <Input
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="Enter filename"
                  className="max-w-xs"
                />
              </div>
              <Button onClick={handleGeneratePDF} disabled={isProcessing}>
                Generate PDF
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Data Preview</h2>
              <Button onClick={addRow} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </Button>
            </div>

            <DataFilter 
              headers={headers}
              filters={filters}
              onFilterChange={setFilters}
              data={data}
            />

            <div className="mt-4 relative">
              <div className="w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] sticky left-0 bg-background">Actions</TableHead>
                      {headers.map((header) => (
                        <TableHead 
                          key={header} 
                          className="min-w-[150px] cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort(header)}
                        >
                          <div className="flex items-center justify-between">
                            {header}
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                            {sortConfig.key === header && (
                              <span className="ml-1">
                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedData.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell className="sticky left-0 bg-background">
                          <div className="flex gap-2">
                            {editingIndex === rowIndex ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={cancelEdit}
                              >
                                ✓
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingIndex(rowIndex)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteRow(rowIndex)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                        {headers.map((header) => (
                          <TableCell 
                            key={`${rowIndex}-${header}`}
                            className="min-w-[150px]"
                          >
                            {editingIndex === rowIndex ? (
                              <Input
                                value={row[header] || ''}
                                onChange={(e) => updateCell(rowIndex, header, e.target.value)}
                              />
                            ) : (
                              row[header] || ''
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}