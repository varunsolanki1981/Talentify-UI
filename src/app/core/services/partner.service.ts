import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PartnerService {

  private apiUrl = 'http://localhost:8080/userapi/api/partners';

  constructor(private http: HttpClient) {}

  savePartner(data: any) {
    return this.http.post('http://localhost:8080/userapi/api/partners/save', data);
  }

  approve(id: number) {
  return this.http.post(`http://localhost:8080/userapi/api/partners/${id}/approve`, {});
}

reject(id: number, reason: string) {
  return this.http.post(`http://localhost:8080/userapi/api/partners/${id}/reject`, { reason });
}

getPartners(status?: string) {
  let url = 'http://localhost:8080/userapi/api/partners/getPartners';
  if (status) url += `?status=${status}`;
  return this.http.get<any[]>(url);
}

getSlaStats() {
  return this.http.get<any>('http://localhost:8080/userapi/api/partners/analytics/sla');
}

}