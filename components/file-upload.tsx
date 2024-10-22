"use client"

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { FileSpreadsheet, Upload } from 'lucide-react'
import { processExcel } from '@/lib/excel-processor'
import { generatePDF } from '@/lib/pdf-generator'

export function FileUpload() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

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

      // Process Excel file
      const data = await processExcel(file)
      setProgress(50)

      // Generate PDF
      await generatePDF(data)
      setProgress(100)

      toast({
        title: "Success!",
        description: "Your PDF report has been generated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the file. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center">
        <FileSpreadsheet className="h-12 w-12 text-primary mb-4" />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <Button className="mb-2">
              <Upload className="mr-2 h-4 w-4" />
              Select Excel File
            </Button>
            <p className="text-sm text-muted-foreground">
              Upload your financial Excel sheet
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={isProcessing}
          />
        </label>

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
  )
}