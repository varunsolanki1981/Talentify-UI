import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PartnerService } from '../../../core/services/partner.service';
import { MatDialog } from '@angular/material/dialog';
import { Rejectdialog } from './rejectdialog/rejectdialog';
import { GridReadyEvent, SortIndicatorComp, ValueFormatterParams } from 'ag-grid-community';
import { Viewpartner } from './viewpartner/viewpartner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-partneradmin',
  standalone: false,
  templateUrl: './partneradmin.html',
  styleUrl: './partneradmin.css',
})
export class Partneradmin {

  rowData: any[] = [];
  gridApi: any;
  selectedStatus = 'PENDING';

  thresholdDays = 1;
  overdueCount = 0;

  slaStats: any = {
    avgHours: 0,
    minHours: 0,
    maxHours: 0
  };

  columnDefs = [
    { field: 'organizationName', width: 170, },
    { field: 'contactPerson', width: 170, },
    { field: 'email', width: 200, },
    { field: 'category', width: 100, },
    {
      field: 'rejectReason', headerName: 'Reject Reason', colId: 'rejectReason',
      cellStyle: (p: any) =>
        p.data.status === 'REJECTED' ? { color: 'red' } : null
    },

    {
      field: 'status',
      filter: true,
      sortable: true,
      width: 170,
      cellStyle: (p: any) => {
        if (p.value === 'APPROVED') return { color: 'green' };
        if (p.value === 'REJECTED') return { color: 'red' };
        return { color: 'orange' };
      }
    },
    {
      field: 'createdAt',
      headerName: 'Created',

      //  valueFormatter: (params: ValueFormatterParams) => {
      // // params.value is the raw data from the field
      //     //return this.datePipe.transform(params.data.createdAt, 'dd/MM/yyyy');
      //     if (params.value) {
      //       return this.datePipe.transform(params.value.toLocaleDateString(), 'dd/MM/yyyy');
      //     }
      //     return '';
      //   }

      // valueFormatter: (params: any) =>
      //   this.datePipe.transform(params.value, 'medium')
    },
    {
      field: 'reviewedAt',
      headerName: 'Reviewed',
      // valueFormatter: (params: any) =>
      //   this.datePipe.transform(params.value, 'medium')
    }, {
      headerName: 'Time Since',
      width: 130,
      valueGetter: (params: any) => this.getTimeAgo(params.data.createdAt),
      cellStyle: (params: any) => {

        //     🔴 > 3 days → urgent
        // 🟠 > 1 day → warning
        // ⚪ fresh → normal

        const created = new Date(params.data.createdAt).getTime();
        const now = new Date().getTime();
        const diffDays = (now - created) / (1000 * 60 * 60 * 24);

        if (params.data.status === 'PENDING') {
          if (diffDays > 3) return { color: 'red' };
          if (diffDays > 1) return { color: 'orange' };
        }

        return null;
      }
    }, {
      headerName: 'Actions',
      width: 250,
      cellRenderer: (params: any) => {
        let buttons = `<button class="btn-view spaced-button btn btn-sm btn-primary icon-container">View</button>`;
        if (params.data.status === 'PENDING') {
          buttons += `
          <button type="button"class="btn-approve spaced-button btn btn-sm btn-primary icon-container">Approve</button>
          <button type="button" class="btn-reject spaced-button btn btn-sm btn-danger icon-container">Reject</button>
        `;
        }

        if (params.data.status === 'REJECTED') {
          buttons += `
          <button type="button"class="btn-approve spaced-button btn btn-sm btn-primary icon-container">Approve</button>
          <button type="button" class="btn-reject spaced-button btn btn-sm btn-danger icon-container">Pending</button>
        `;
        }

        if (params.data.status === 'APPROVED') {
          buttons += `
          <button type="button"class="btn-approve spaced-button btn btn-sm btn-primary icon-container">Pending</button>
          <button type="button" class="btn-reject spaced-button btn btn-sm btn-danger icon-container">Reject</button>
        `;
        }
        return buttons;
      },
      onCellClicked: (params: any) => {

        if (params.event.target.classList.contains('btn-view')) {
          this.viewDetails(params.data);
        }

        if (params.event.target.classList.contains('btn-approve')) {
          this.approve(params.data.id);
        }

        if (params.event.target.classList.contains('btn-reject')) {
          this.reject(params.data.id);
        }
      }
    }
  ];

  viewDetails(data: any) {
    this.dialog.open(Viewpartner, {
      width: '500px',
      data: data
    });
  }

  constructor(private partnerService: PartnerService,
    private dialog: MatDialog, private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe) {

  }

  getTimeAgo(date: string): string {
    const now = new Date().getTime();
    const created = new Date(date).getTime();
    const diff = Math.floor((now - created) / 1000); // seconds

    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min ago`;
    return 'Just now';
  }

  // Always use this for ExpressionChangedAfterItHasBeenCheckedError in Angular
  ngAfterViewInit() {
    //this.gridApi.setColumnsVisible('colId', false);
    this.load();
    this.loadSla();
    this.cdRef.detectChanges(); // Manual re-check
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.load();
    this.loadSla();
    //this.gridApi.setColumnsVisible('rejectReason', true);
    this.gridApi.refreshCells({ force: true });
  }

  load() {
    this.partnerService.getPartners(this.selectedStatus)
      .subscribe(data => {
        this.rowData = data;
         this.gridApi.setGridOption('rowData', this.rowData);
        this.cdRef.detectChanges();
        // this.calculateOverdue(); // 🔥 update badge
      });
  }

  onTabChange(status: string) {
    //this.gridApi.setColumnsVisible('rejectReason', this.selectedStatus === 'REJECTED');
    this.selectedStatus = status;
    this.load();
    //this.gridApi.refreshCells({ force: true });
  }

  approve(id: number) {
    if (!confirm('Approve this partner?')) return;

    this.partnerService.approve(id)
      .subscribe(() => this.load());
    //  this.cdRef.detectChanges();
    this.gridApi.refreshCells({ force: true });
  }

  reject(id: number) {
    const dialogRef = this.dialog.open(Rejectdialog);

    dialogRef.afterClosed().subscribe(reason => {

      if (!reason) return;

      this.partnerService.reject(id, reason)
        .subscribe(() => this.load());
    });
      // this.cdRef.detectChanges();
  }

  loadSla() {
    this.partnerService.getSlaStats()
      .subscribe(res => this.slaStats = res);
  }

  formatHours(hours: number): string {
    if (hours < 24) return `${hours} hrs`;

    const days = Math.floor(hours / 24);
    const remHours = hours % 24;

    return `${days}d ${remHours}h`;
  }

  //    calculateOverdue() {
  //   const now = new Date().getTime();

  //   this.overdueCount = this.rowData.filter((p: any) => {

  //     if (p.status !== 'PENDING') return false;

  //     const created = new Date(p.createdAt).getTime();
  //     const diffDays = (now - created) / (1000 * 60 * 60 * 24);

  //     return diffDays > this.thresholdDays;

  //   }).length;
  // }

  //   rowClassRules = {
  //   'row-overdue': (params: any) => {
  //     if (params.data.status !== 'PENDING') return false;

  //     const created = new Date(params.data.createdAt).getTime();
  //     const now = new Date().getTime();
  //     const diffDays = (now - created) / (1000 * 60 * 60 * 24);

  //     return diffDays > this.thresholdDays;
  //   }
  // };

}
