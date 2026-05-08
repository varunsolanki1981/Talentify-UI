import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest, ContactResponse, EmailResponse, RecordCard } from '../models/user.interface';
import { Observable } from 'rxjs/internal/Observable';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

@Injectable({
  providedIn: 'root',
})
export class DonationService {

  private donationApiUrl = 'http://localhost:8080/userapi/api/donations';
  private invoiceApiUrl = 'http://localhost:8080/userapi/api/invoice';

  constructor(private http: HttpClient) { }

  saveDonation(data: any) {
    return this.http.post(this.donationApiUrl, data);
  }

  downloadInvoice(id: number) {
    return this.http.get(`${this.invoiceApiUrl}/${id}`, {
      responseType: 'blob'
    });
  }

  // resendInvoice(id: number) {
  //   return this.http.post(
  //     `http://localhost:8080/userapi/api/invoice/resend-invoice/${id}`, { responseType: 'text' } as any
  //   );
  // }

  resendInvoice(id: any): Promise<any> {
    const request$ = this.http.post(
      `http://localhost:8080/userapi/api/invoice/resend-invoice/${id}`, {  }  
    );
    return lastValueFrom(request$);
  }

  getAllDonations() {
    return this.http.get('http://localhost:8080/userapi/api/donations');
  }

  deleteDonation(id: number) {
    return this.http.delete(`http://localhost:8080/userapi/api/donations/${id}`);
  }

  getSummary() {
    return this.http.get('http://localhost:8080/userapi/api/donations/summary');
  }

  getMonthlyAnalytics(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/userapi/api/donations/analytics/monthly');
  }

  getMonthlyDonationsByYear(year: number) {
  return this.http.get<any[]>(`http://localhost:8080/userapi/api/donations/monthly/${year}`);
}

  getYearlyDonations(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/userapi/api/donations/analytics/yearly');
  }

  getCategoryAnalytics(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/userapi/api/donations/analytics/category');
  }

  getPaymentTypeAnalytics(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/userapi/api/donations/analytics/paymentType');
  }

  getAnalytics(range: string, year?: number) {
    let url = `http://localhost:8080/userapi/api/donations/analytics?range=${range}`;
    if (year) url += `&year=${year}`;
    return this.http.get<any>(url);
  }

  getDashboard() {
  return this.http.get<any>('http://localhost:8080/userapi/api/analytics/dashboard');
}

  loadYearlyChartForEnquiries() {
    this.http.get<any[]>('/api/enquiries/yearly')
     return this.http.get<any[]>('http://localhost:8080/userapi/auth/enquiries/yearly');
  }

  loadMonthlyChart(year: number) {
    return this.http.get<any[]>(`http://localhost:8080/userapi/auth/enquiries/monthly/${year}`);
  }

  drillDown() {
    this.http.get<any[]>('/api/enquiries/yearly')
     return this.http.get<any[]>('http://localhost:8080/userapi/api/donations/drill');
  }

}
