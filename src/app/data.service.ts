import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';

export interface PopulationData {
  countryName: string;
  countryCode: string;
  year: number;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  async loadPopulationData(): Promise<PopulationData[]> {
    try {
      const response = await fetch('/data.csv');
      const csvText = await response.text();
      
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data.map((row: any) => ({
              countryName: row['Country Name'],
              countryCode: row['Country Code'],
              year: parseInt(row['Year']),
              value: parseInt(row['Value'])
            })).filter(item => item.countryName && item.year && item.value);
            
            resolve(data);
          },
          error: (error: any) => {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error loading CSV:', error);
      throw error;
    }
  }

  getUniqueCountries(data: PopulationData[]): string[] {
    const countries = [...new Set(data.map(d => d.countryName))];
    return countries.sort();
  }

  getUniqueYears(data: PopulationData[]): number[] {
    const years = [...new Set(data.map(d => d.year))];
    return years.sort((a, b) => a - b);
  }

  filterData(data: PopulationData[], country?: string, year?: number): PopulationData[] {
    let filtered = data;
    
    if (country) {
      filtered = filtered.filter(d => d.countryName === country);
    }
    
    if (year) {
      filtered = filtered.filter(d => d.year === year);
    }
    
    return filtered;
  }
}
