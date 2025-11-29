import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DataService, PopulationData } from '../data.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  allData: PopulationData[] = [];
  filteredData: PopulationData[] = [];
  countries: string[] = [];
  years: number[] = [];
  
  selectedCountry: string = '';
  selectedYear: number = 0;
  
  lineChart: Chart | null = null;
  barChart: Chart | null = null;
  
  loading: boolean = true;
  
  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}
  
  async ngOnInit() {
    try {
      this.allData = await this.dataService.loadPopulationData();
      this.countries = this.dataService.getUniqueCountries(this.allData);
      this.years = this.dataService.getUniqueYears(this.allData);
      
      this.filteredData = this.allData;
      this.loading = false;
      
      // Force Angular to update the DOM
      this.cdr.detectChanges();
      
    } catch (error) {
      console.error('ERROR loading data:', error);
      this.loading = false;
    }
  }
  
  ngAfterViewInit() {
    // Wait for DOM to be fully ready
    setTimeout(() => {
      if (!this.loading && this.allData.length > 0) {
        const defaultCountries = this.countries.slice(0, 5);
        this.createLineChart(defaultCountries);
        this.createBarChart(this.years[this.years.length - 1]);
      }
    }, 1000);
  }
  
  onFilterChange() {
    this.filteredData = this.dataService.filterData(
      this.allData, 
      this.selectedCountry || undefined, 
      this.selectedYear || undefined
    );
  }
  
  createLineChart(countries: string[]) {
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('lineChart canvas not found!');
      return;
    }
    
    const datasets = countries.map((country, index) => {
      const countryData = this.allData.filter(d => d.countryName === country);
      const sortedData = countryData.sort((a, b) => a.year - b.year);
      
      return {
        label: country,
        data: sortedData.map(d => ({ x: d.year, y: d.value })),
        borderColor: this.getColor(index),
        backgroundColor: this.getColor(index, 0.1),
        tension: 0.1,
        fill: false
      };
    });
    
    const config: ChartConfiguration = {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Population Over Time',
            font: { size: 16 }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Year'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Population'
            }
          }
        }
      }
    };
    
    this.lineChart = new Chart(ctx, config);
    console.log('Line chart created!');
  }
  
  createBarChart(year: number) {
    if (this.barChart) {
      this.barChart.destroy();
    }
    
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('barChart canvas not found!');
      return;
    }
    
    const yearData = this.allData.filter(d => d.year === year);
    const top10 = yearData
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
    
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: top10.map(d => d.countryName),
        datasets: [{
          label: `Population in ${year}`,
          data: top10.map(d => d.value),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Top 10 Countries by Population (${year})`,
            font: { size: 16 }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Population'
            }
          }
        }
      }
    };
    
    this.barChart = new Chart(ctx, config);
    console.log('Bar chart created!');
  }
  
  updateLineChart() {
    if (this.selectedCountry) {
      this.createLineChart([this.selectedCountry]);
    }
  }
  
  updateBarChart() {
    if (this.selectedYear) {
      this.createBarChart(this.selectedYear);
    }
  }
  
  getColor(index: number, alpha: number = 1): string {
    const colors = [
      `rgba(255, 99, 132, ${alpha})`,
      `rgba(54, 162, 235, ${alpha})`,
      `rgba(255, 206, 86, ${alpha})`,
      `rgba(75, 192, 192, ${alpha})`,
      `rgba(153, 102, 255, ${alpha})`,
      `rgba(255, 159, 64, ${alpha})`
    ];
    return colors[index % colors.length];
  }
}
