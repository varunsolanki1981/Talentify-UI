import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DonationService } from '../../../core/services/donationservice';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { Router } from '@angular/router';
import 'chart.js/auto'; // ADD THIS must be added to use Chart without errors about missing controllers or elements


@Component({
  selector: 'app-backup',
  standalone: false,
  templateUrl: './backup.html',
  styleUrl: './backup.css',
})
export class Backup {
  monthlyChart!: { labels: any; datasets: { data: any; label: 'Donations ($)' }[]; };
  categoryChart!: { labels: any; datasets: { data: any; }[]; };
  agingChart!: { labels: string[]; datasets: { data: {}[]; }[]; };

  constructor(private donationService: DonationService, private cdRef: ChangeDetectorRef
    , private route: Router, private cdr: ChangeDetectorRef
  ) { }


  selectedRange = '30days';
  //selectedYear = new Date().getFullYear();

  years: number[] = [];

  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [], label: 'Categories' }]
  };

  public paymentTypeChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [], label: 'Payment Types' }]
  };

  public pieChartType: ChartType = 'pie';
  rowData: any[] = [];

  summary: any = {
    totalAmount: 0,
    totalCount: 0
  };

  dashboard: any = {};

  monthlyLabels: string[] = [];
  monthlyData: number[] = [];

  categoryLabels: string[] = [];
  categoryData: number[] = [];

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


  // ngOnInit() {
  //   //this.loadSummary();
  //   //this.loadMonthly();
  //   // this.loadCategory();
  //   // this.loadCategoryWithPercentage();
  //   //this.generateYears();
  //   //this.loadAnalytics();
  //   // this.loadDashboard();

  // }

  ngAfterViewInit() {
    // this.loadMonthly();
    this.loadCategoryWithPercentage();
    this.loadPaymentTypeWithPercentage();
    this.loadMonthlyChart();
    //this.loadYearlyChart();
     this.loadYearly();
    this.loadDashboard();

  }

    chartType: ChartType = 'bar';
  chartLabels: string[] = [];
  chartData: any[] = [];

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
          'Jan','Feb','Mar','Apr','May','Jun',
          'Jul','Aug','Sep','Oct','Nov','Dec'
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
  prepareCharts() {

    // // Donation Monthly
    // this.monthlyChart = {
    //   labels: this.dashboard.monthlyDonation.map((m: any) => m.month),
    //   datasets: [{
    //     data: this.dashboard.monthlyDonation.map((m: any) => m.amount),
    //     label: 'Donations ($)'
    //   }]
    // };

    // // Category
    // this.categoryChart = {
    //   labels: this.dashboard.categoryDonation.map((c: any) => c.category),
    //   datasets: [{
    //     data: this.dashboard.categoryDonation.map((c: any) => c.amount)
    //   }]
    // };

    // Aging
    const order = ['0-1 days', '1-3 days', '3-7 days', '7+ days'];
    const map = new Map(this.dashboard.aging.map((a: any) => [a.bucket, a.count]));

    this.agingChart = {
      labels: order,
      datasets: [{ data: order.map(o => map.get(o) || 0) }]
    };
  }

  loadCategoryWithPercentage() {
    this.donationService.getCategoryAnalytics().subscribe((res: any[]) => {
      console.log(res),
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
        this.paymentTypeChartData = {
          labels: Object.values(res.map(r => r.category)),
          datasets: [{ data: Object.values(res.map(r => r.amount)) }]
        };
    });
    // this.cdRef.detectChanges();
  }

loadYearlyChart() {
    this.donationService.getYearlyDonations()
      .subscribe(res => {

        const yearlyData = new Array(5).fill(0);
        const currentYear = new Date().getFullYear();

        res.forEach((item: any) => {
          const yearIndex = currentYear - item.year;
          if (yearIndex >= 0 && yearIndex < 5) {
            yearlyData[4 - yearIndex] = item.amount; // Reverse order for display
          }
        });

        this.createYearlyChart(yearlyData);
      });
  }

  currentYear = new Date().getFullYear();
  createYearlyChart(data: number[]) {
    const canvas = document.getElementById('yearlyDonationChart') as HTMLCanvasElement | null;

    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#3f51b5');
    gradient.addColorStop(1, '#2196f3');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [this.currentYear - 4, this.currentYear - 3, this.currentYear - 2, this.currentYear - 1, this.currentYear],
        datasets: [{
          label: 'Yearly Donations',
          data: data,
          backgroundColor: gradient,
          borderRadius: 8,
          //barThickness: 30
        }]
      }, options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#333',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              title: (ctx) => 'Year: ' + ctx[0].label,
              label: function (context) {
                const value = context.raw as number;
                return 'Donation: $' + value.toLocaleString();
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '$' + Number(value).toLocaleString()
            }
          }
        }
      }
    });
  }

  loadMonthlyChart() {
    this.donationService.getMonthlyAnalytics()
      .subscribe(res => {

        const monthlyData = new Array(12).fill(0);

        res.forEach(item => {

          const monthIndex = item.month - 1;
          monthlyData[monthIndex] = item.amount;
        });

        this.createMonthlyChart(monthlyData);
      });
  }

  createMonthlyChart(data: number[]) {
    const canvas = document.getElementById('donationChart') as HTMLCanvasElement | null;

    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#3f51b5');
    gradient.addColorStop(1, '#2196f3');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Monthly Donations',
          data: data,
          backgroundColor: gradient,
          borderRadius: 8,
          //barThickness: 30
        }]
      }, options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#333',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              title: (ctx) => 'Month: ' + ctx[0].label,
              label: function (context) {
                const value = context.raw as number;
                return 'Donation: $' + value.toLocaleString();
              }
            }
          }
        },
        scales: {
          // x: {
          //   ticks: {
          //     autoSkip: false,   // 🔥 IMPORTANT: show all labels
          //     maxRotation: 0,    // prevent tilt
          //     minRotation: 0
          //   }
          // },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '$' + Number(value).toLocaleString()
            }
          }
        }
      }
    });
  }

  navTo(path: string) {
    console.log(`Navigating to ${path}`);
    this.route.navigateByUrl(path);
  }

  //   generateYears() {
  //   const current = new Date().getFullYear();
  //   for (let i = current; i >= current - 5; i--) {
  //     this.years.push(i);
  //   }
  // }

  // loadAnalytics() {
  //   this.donationService
  //     .getAnalytics(this.selectedRange, this.selectedYear)
  //     .subscribe((res: any[]) => {

  //       // Monthly
  //       this.monthlyLabels = Object.values(res.map(r => this.getMonthName(r.month)));
  //       this.monthlyData = Object.values(res.map(r => r.amount));

  //       // Category
  //       this.categoryLabels = Object.values(res.map(r => r.category));
  //       this.categoryData = Object.values(res.map(r => r.amount));
  //     });
  // }

  // onFilterChange() {
  //   this.loadAnalytics();
  // }

  // loadMonthly() {
  //   this.donationService.getMonthlyAnalytics()
  //     .subscribe((res: any[]) => {

  //       this.monthlyLabels = Object.values(res.map(r => this.getMonthName(r.month)));
  //       this.monthlyData = Object.values(res.map(r => r.amount));
  //     });
  //   // this.cdRef.detectChanges();
  // }

  // loadCategory() {
  //   this.donationService.getCategoryAnalytics()
  //     .subscribe((res: any[]) => {

  //       this.categoryLabels = Object.values(res.map(r => r.category));
  //       this.categoryData = Object.values(res.map(r => r.amount));
  //     });
  // }

  // getMonthName(month: number): string {
  //   return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1];
  // }

  // loadSummary() {
  //   this.donationService.getSummary()
  //     .subscribe((res: any) => {
  //       this.summary = res;
  //     });
  // }

}
