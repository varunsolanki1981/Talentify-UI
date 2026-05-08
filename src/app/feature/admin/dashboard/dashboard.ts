import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DonationService } from '../../../core/services/donationservice';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { Router } from '@angular/router';
import 'chart.js/auto'; // ADD THIS must be added to use Chart without errors about missing controllers or elements
import * as Highcharts from 'highcharts';
import 'highcharts/highcharts-3d'; // Direct side-effect import

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  Highcharts: typeof Highcharts = Highcharts;
  monthlyChart!: { labels: any; datasets: { data: any; label: 'Donations ($)' }[]; };
  categoryChart!: { labels: any; datasets: { data: any; }[]; };
  agingChart!: { labels: string[]; datasets: { data: {}[]; }[]; };

  constructor(private donationService: DonationService, private cdRef: ChangeDetectorRef
    , private route: Router, private cdr: ChangeDetectorRef
  ) { }

  enquiriesChart!: any;
  chartType: ChartType = 'bar';
  chartLabels: string[] = [];
  chartData: any[] = [];
  selectedRange = '30days';
  category3DOptions: Highcharts.Options = {};
  payment3DOptions: Highcharts.Options = {};

  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [], label: 'Categories' }]
  };

  public paymentTypeChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [], label: 'Payment Types' }]
  };

  public pieChartType: ChartType = 'pie';
  dashboard: any = {};

  // 1. Register the plugin locally for this chart
  public pieChartPlugins = [DatalabelsPlugin];

  // 2. Configure Options including Percentage Logic
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      datalabels: {
        formatter: (value, ctx) => {
          const datapoints = ctx.chart.data.datasets[0].data as number[];
          const total = datapoints.reduce((total, num) => total + num, 0);
          const percentage = ((value / total) * 100).toFixed(1) + "%";
          return percentage;
        },
        color: '#fff', // Label text color
      },
    }
  };

  ngAfterViewInit() {
    this.loadYearly();
    this.loadDashboard();
    this.loadYearlyChartForEnquiries();
    this.loadCategoryWithPercentage();
    this.loadPaymentTypeWithPercentage();
  }

  loadYearlyChartForEnquiries() {
    this.donationService.loadYearlyChartForEnquiries().subscribe(res => {

      const labels = res.map(r => r[0]); // year
      const data = res.map(r => r[1]);

      this.renderChart(labels, data, 'Enquiries Per Year', true);
    });
  }

  loadMonthlyChart(year: number) {
    this.donationService.loadMonthlyChart(year).subscribe(res => {

      const monthlyData = new Array(12).fill(0);

      res.forEach(r => {
        monthlyData[r[0] - 1] = r[1];
      });

      const labels = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      this.renderChart(labels, monthlyData, `Enquiries in ${year}`, false);
    });
  }

  renderChart(labels: any[], data: any[], title: string, drillDown: boolean) {
    if (this.enquiriesChart) {
      this.enquiriesChart.destroy(); // prevent flicker
    }

    const canvas = document.getElementById('enquiryChart') as HTMLCanvasElement;

    this.enquiriesChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: title,
          data
        }]
      },
      options: {
        responsive: true,
        animation: {
          duration: 800
        },
        onClick: (event: any, elements: any[]) => {
          if (drillDown && elements.length > 0) {
            const index = elements[0].index;
            const year = labels[index];
            this.loadMonthlyChart(year);
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx: any) => `Enquiries: ${ctx.raw}`
            }
          }
        }
      }
    });
  }

  selectedYear: number | null = null;

  // ✅ YEARLY VIEW
  loadYearly() {
    this.selectedYear = null;

    this.donationService.getYearlyDonations().subscribe(res => {
      //console.log('Yearly donations response:', res);
      if (!res || !Array.isArray(res)) {
        console.error('Invalid response:', res);
        return;
      }

      const map = new Map(
        (res ?? []).map((r: any) => [r.year.toString(), r.amount])
      );

      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 6;

      const years: string[] = [];
      for (let y = startYear; y <= currentYear; y++) {
        years.push(y.toString());
      }

      const amounts = years.map(y => map.get(y) || 0);

      this.chartLabels = years;
      this.chartData = [{
        data: amounts,
        label: 'Yearly Donations',
        borderRadius: 8,
        backgroundColor: '#42a5f5'
      }];
      this.cdr.detectChanges();
    });
  }

  // ✅ MONTHLY VIEW (DRILL-DOWN)
  loadMonthly(year: number) {
    this.selectedYear = year;

    this.donationService.getMonthlyDonationsByYear(year).subscribe(res => {

      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      const map = new Map(res.map((r: any) => [r[0], r[1]]));

      const amounts = months.map((_, i) => map.get(i + 1) || 0);

      this.chartLabels = months;
      this.chartData = [{
        data: amounts,
        label: `Monthly Donations (${year})`,
        borderRadius: 8,
        backgroundColor: '#66bb6a'
      }];
      this.cdr.detectChanges(); // Ensure view updates before handling click 
    });
  }

  // ✅ CLICK HANDLER
  onChartClick(event: any) {
    // console.log('Chart click event:', event);
    if (event.active.length > 0) {
      const index = event.active[0].index;

      if (!this.selectedYear) {
        // 👉 From YEAR → MONTH
        const year = Number(this.chartLabels[index]);
        this.loadMonthly(year);
      }
    }
  }

  // ✅ BACK BUTTON
  goBack() {
    console.log('Going back to yearly view');
    this.loadYearly();
  }

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: any) => `$${ctx.raw?.toLocaleString()}`
        }
      }
    }
  };

  // loading Partner Dashboard Data and Donation and Anv Approval Analytics 
  loadDashboard() {
    this.donationService.getDashboard()
      .subscribe(res => {
        this.dashboard = res;
        console.log('Dashboard Data:', this.dashboard); // Debug log
        //this.prepareCharts();
        this.cdRef.detectChanges();
      });
  }

 

  loadCategoryWithPercentage() {
    this.donationService.getCategoryAnalytics().subscribe((res: any[]) => {

      this.category3DOptions = {
        chart: {
          type: 'pie',
          styledMode: true, // ✅ IMPORTANT
          options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
          }
        },
        title: {
          text: 'Category Distribution'
        }, tooltip: {
          pointFormat: '<b>{point.percentage:.1f}%</b> (${point.y})'
        }, plotOptions: {
          pie: {
            innerSize: 100,
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 50,
            dataLabels: {
              enabled: true,
              format: '{point.name}: {point.percentage:.1f}%'
            }
          }
        },
        series: [{
          allowPointSelect: true,
          type: 'pie',
          name: 'Share',
          keys: ['name', 'y', 'selected', 'sliced'],
          showInLegend: true,
          data: res.map((r: any) => ({
            name: r.category,
            y: r.amount,
            sliced: true
          }))
        }]

      };
      this.pieChartData = {
        labels: Object.values(res.map(r => r.category)),
        datasets: [{ data: Object.values(res.map(r => r.amount)) }]
      };
    });
    // this.cdRef.detectChanges();
  }

  loadPaymentTypeWithPercentage() {
    this.donationService.getPaymentTypeAnalytics().subscribe((res: any[]) => {
      console.log(res),

        this.payment3DOptions = {
          chart: {
            backgroundColor: '#f4f4f4', // Set your desired hex, rgb, or color name,
            type: 'pie',
            styledMode: true, // ✅ IMPORTANT
            options3d: {
              enabled: true,
              alpha: 45,
              beta: 0,
              viewDistance: 25 //for a more cinematic perspective.
            }
          },
          title: {
            text: 'Payment Type Distribution'
          }, tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b> (${point.y})'
          }, plotOptions: {
            pie: {
              innerSize: 100, //3D Donut: Add innerSize: 100 to plotOptions.pie to make it a thick 3D ring
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 35,
              dataLabels: {
                enabled: true,
                format: '{point.name}: {point.percentage:.1f}%'
              }
            }
          },
          series: [{
            allowPointSelect: true,
            type: 'pie',
            name: 'Share',
            keys: ['name', 'y', 'selected', 'sliced'],
            showInLegend: true,
            data: res.map((r: any) => ({
              name: r.category,
              y: r.amount,
              sliced: true //to see a 3D chunk pop out
            }))
          }]

        };

      this.paymentTypeChartData = {
        labels: Object.values(res.map(r => r.category)),
        datasets: [{ data: Object.values(res.map(r => r.amount)) }]
      };
    });
    // this.cdRef.detectChanges();
  }

  navTo(path: string) {
    console.log(`Navigating to ${path}`);
    this.route.navigateByUrl(path);
  }

}
