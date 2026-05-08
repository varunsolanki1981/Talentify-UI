import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest, ContactResponse, EmailResponse, RecordCard } from '../models/user.interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class RecordService {

  private apiUrl = 'http://localhost:8080/userapi/api/records';
  // private EMAIL_API = 'http://localhost:8080/userapi/api/records';
  // private ENQ_API = 'http://localhost:8080/userapi/api/records';


constructor(private http: HttpClient) {}

  getAll(): Observable<RecordCard[]> {
    return this.http.get<RecordCard[]>(this.apiUrl);
  }

  create(record: RecordCard): Observable<RecordCard> {
    return this.http.post<RecordCard>(this.apiUrl, record);
  }

  update(id: number, record: RecordCard): Observable<RecordCard> {
    return this.http.put<RecordCard>(`${this.apiUrl}/${id}`, record);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  findByGovCategory(category: string): Observable<RecordCard[]> {
    return this.http.get<RecordCard[]>(`${this.apiUrl}/findByCategory/${category}`);
  }
  
}
