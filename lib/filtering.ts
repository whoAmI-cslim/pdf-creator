export interface FilterConfig {
    column: string;
    value: string;
    operator: FilterOperator;
  }
  
  export type FilterOperator = 'contains' | 'equals' | 'greater' | 'less' | 'startsWith' | 'endsWith';
  
  export const FILTER_OPERATORS: { value: FilterOperator; label: string }[] = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'greater', label: 'Greater Than' },
    { value: 'less', label: 'Less Than' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
  ];
  
  export function filterData<T>(data: T[], filters: FilterConfig[]): T[] {
    return data.filter(item => {
      return filters.every(filter => {
        const value = item[filter.column as keyof T];
        const filterValue = filter.value.toLowerCase();
        const itemValue = String(value).toLowerCase();
        
        switch (filter.operator) {
          case 'contains':
            return itemValue.includes(filterValue);
          case 'equals':
            return itemValue === filterValue;
          case 'greater':
            return !isNaN(Number(value)) && !isNaN(Number(filter.value)) && 
              Number(value) > Number(filter.value);
          case 'less':
            return !isNaN(Number(value)) && !isNaN(Number(filter.value)) && 
              Number(value) < Number(filter.value);
          case 'startsWith':
            return itemValue.startsWith(filterValue);
          case 'endsWith':
            return itemValue.endsWith(filterValue);
          default:
            return true;
        }
      });
    });
  }