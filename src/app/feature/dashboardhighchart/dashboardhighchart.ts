import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

import * as Highcharts from 'highcharts';
import 'highcharts/highcharts-3d';
import 'highcharts/modules/cylinder';
import { DonationService } from '../../core/services/donationservice';
import 'highcharts/modules/drilldown'; // ✅ must be present


@Component({
  selector: 'app-dashboardhighchart',
  standalone: false,
  templateUrl: './dashboardhighchart.html',
  styleUrl: './dashboardhighchart.css',
})
export class Dashboardhighchart {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  viewMode: 'year' | 'month' = 'year';
  selectedYear = '';
  availableYears: string[] = [];
  rawDonations: any = {};
  monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private donationService: DonationService, private route: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.ngOnInitNew();
    //this.ngOnInitByButton();
  }

  changeView(mode: 'year' | 'month') {
    this.viewMode = mode;
    this.updateChart();
  }

  ngOnInitByButton() {
    this.donationService.drillDown().subscribe(res => {
      this.rawDonations = res || {};
      this.availableYears = Object.keys(this.rawDonations).sort();
      if (this.availableYears.length) {
        this.selectedYear = this.availableYears[0];
      }
      this.updateChart();
      this.cdr.detectChanges();
    });
  }
  updateChart() {
    if (this.viewMode === 'year') {
      this.buildYearlyChart();
    } else {
      this.buildMonthlyChart();
    }
  }

  buildYearlyChart() {
    const categories: string[] = [];
    const seriesData: any[] = [];

    this.availableYears.forEach(year => {
      const months = this.rawDonations[year] || {};
      const total = Object.keys(months).reduce((sum, monthKey) => sum + (months[monthKey] || 0), 0);
      categories.push(year);
      seriesData.push({ name: year, y: total });
    });

    this.chartOptions = {
      chart: {
        type: 'cylinder',
        animation: true,
        styledMode: true,
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          depth: 50,
          viewDistance: 25
        }
      },
      title: {
        text: 'Yearly Donations'
      },
      subtitle: {
        text: 'Switch to monthly to compare donations by month.'
      },
      xAxis: {
        categories,
        title: { text: 'Year' },
        labels: {
          skew3d: true
        }
      },
      yAxis: {
        title: { text: 'Amount' },
        labels: {
          skew3d: true
        }
      },
      legend: { enabled: false },
      series: [{
        name: 'Donations',
        colorByPoint: true,
        data: seriesData
      }]
    };
  }

  buildMonthlyChart() {
    const categories = this.monthNames;
    const seriesData: any[] = [];
    let subtitle = 'Monthly total across all years.';

    if (this.selectedYear && this.rawDonations[this.selectedYear]) {
      const months = this.rawDonations[this.selectedYear];
      categories.forEach((month, index) => {
        const monthNumber = index + 1;
        seriesData.push({ name: month, y: months[monthNumber] || 0 });
      });
      subtitle = `Monthly donations for ${this.selectedYear}.`;
    } else {
      const totalsByMonth = categories.map(() => 0);
      this.availableYears.forEach(year => {
        const months = this.rawDonations[year] || {};
        categories.forEach((_, idx) => {
          totalsByMonth[idx] += months[idx + 1] || 0;
        });
      });
      totalsByMonth.forEach((amount, idx) => {
        seriesData.push({ name: categories[idx], y: amount });
      });
    }

    this.chartOptions = {
      chart: {
        type: 'cylinder',
        animation: true,
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          depth: 50,
          viewDistance: 25
        }
      },
      title: {
        text: this.selectedYear ? `Monthly Donations ${this.selectedYear}` : 'Monthly Donations'
      },
      subtitle: {
        text: subtitle
      },
      xAxis: {
        categories,
        title: { text: 'Month' }
      },
      yAxis: {
        title: { text: 'Amount' }
      },
      legend: { enabled: false },
      series: [{
        name: 'Donations',
        colorByPoint: true,
        data: seriesData
      }]
    };
  }

  onYearSelectionChange(year: string) {
    this.selectedYear = year;
    this.updateChart();
  }

  getMonthName(m: number): string {
    return this.monthNames[m - 1];
  }

  ngOnInitNew() {
    this.donationService.drillDown().subscribe((res: any) => {
      console.log('Drilldown data:', res);
      const yearlySeries: any[] = [];
      const drilldownSeries: any[] = [];

      Object.keys(res).forEach(year => {

        const months = res[year];
        let total = 0;

        const monthData: any[] = [];

        for (let m = 1; m <= 12; m++) {
          const value = months[m] || 0;
          total += value;

          monthData.push({
            name: this.getMonthName(m),
            y: value
          });
        }

        // Year level
        yearlySeries.push({
          name: year,
          y: total,
          drilldown: 'year-' + year
        });

        // Month level
        drilldownSeries.push({
          id: 'year-' + year,
          name: `Monthly Donations ${year}`,
          data: monthData
        });
      });

      this.chartOptions = {
        chart: {
          type: 'column',
          animation: true,
          styledMode: true,
          options3d: {
            enabled: true,
            alpha: 15,
            beta: 15,
            depth: 50,
            viewDistance: 25
          }
        },

        title: {
          text: 'Donations (Year → Month)'
        },

        subtitle: {
          text: 'Click a year to view months. Click "Back" to return.'
        },

        xAxis: {
          type: 'category',
        },

        yAxis: {
          title: {
            text: 'Amount',
             x: -200 // Moves title 10px up
             // margin: 20
          }
        },

        legend: {
          enabled: false
        },

        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '${point.y:.0f}'
            }
          }
        },

        // 👇 MAIN SERIES (YEAR)
        series: [{
          name: 'Yearly',
          colorByPoint: true,
          data: yearlySeries
        }],

        // 👇 DRILLDOWN (MONTH)
        drilldown: {
          breadcrumbs: {
            position: {
              align: 'right'
            }
          },
          drillUpButton: {
            position: {
              align: 'right',
              x: -10,
              y: 10
            }
          },
          series: drilldownSeries
        }
      };
      this.cdr.detectChanges();
    });
  }
}



