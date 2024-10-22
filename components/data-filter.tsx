"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"
import { FilterConfig, FilterOperator, FILTER_OPERATORS } from "@/lib/filtering"

interface DataFilterProps {
  headers: string[]
  filters: FilterConfig[]
  onFilterChange: (filters: FilterConfig[]) => void
  data: any[] // Add data prop to access values
}

export function DataFilter({ headers, filters, onFilterChange, data }: DataFilterProps) {
  const addFilter = () => {
    onFilterChange([
      ...filters,
      { column: headers[0], operator: 'contains', value: '' }
    ])
  }

  const removeFilter = (index: number) => {
    onFilterChange(filters.filter((_, i) => i !== index))
  }

  const updateFilter = (index: number, updates: Partial<FilterConfig>) => {
    const newFilters = filters.map((filter, i) => 
      i === index ? { ...filter, ...updates } : filter
    )
    onFilterChange(newFilters)
  }

  // Get unique values for a column
  const getUniqueValues = (column: string): string[] => {
    const values = data.map(row => String(row[column] || ''))
    return [...new Set(values)]
      .filter(value => value !== '')
      .sort((a, b) => {
        // Try numeric sort first
        const numA = Number(a)
        const numB = Number(b)
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB
        }
        // Fall back to string sort
        return a.localeCompare(b)
      })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Filters</h3>
        <Button variant="outline" onClick={addFilter}>
          Add Filter
        </Button>
      </div>
      
      <div className="space-y-2">
        {filters.map((filter, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Select
              value={filter.column}
              onValueChange={(value) => {
                // Reset value when column changes
                updateFilter(index, { column: value, value: '' })
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filter.operator}
              onValueChange={(value) => updateFilter(index, { operator: value as FilterOperator })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPERATORS.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filter.value}
              onValueChange={(value) => updateFilter(index, { value })}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                {getUniqueValues(filter.column).map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFilter(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}