export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function sortData<T>(data: T[], config: SortConfig): T[] {
  if (!config.key || !config.direction) return data;

  return [...data].sort((a, b) => {
    const aValue = a[config.key as keyof T];
    const bValue = b[config.key as keyof T];

    // Handle numeric values
    if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
      return config.direction === 'asc' 
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    }

    // Handle strings
    const aString = String(aValue || '').toLowerCase();
    const bString = String(bValue || '').toLowerCase();

    if (config.direction === 'asc') {
      return aString.localeCompare(bString);
    }
    return bString.localeCompare(aString);
  });
}