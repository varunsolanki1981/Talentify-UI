import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest, ContactResponse, EmailResponse } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class Adminservice {

  private API = 'http://localhost:8080/userapi/auth';
  private EMAIL_API = 'http://localhost:8080/userapi/emailService';
    private ENQ_API = 'http://localhost:8080/userapi/admin';


  constructor(private http: HttpClient) { }

  updateUser(updatedRecord: RegisterRequest) {
    return this.http.post<RegisterRequest>(`${this.API}/updateUser`, updatedRecord);
  }

  getAllUsers() {
    return this.http.get<RegisterRequest[]>(`${this.API}/users`);
  }

  deleteUser(updatedRecord: RegisterRequest) {
    return this.http.delete<RegisterRequest>(`${this.API}/deleteUser`, { body: updatedRecord });
  }

  getAllEnquiries() {
    return this.http.get<ContactResponse[]>(`${this.ENQ_API}/getAllEnquiries`);
  }

  updateContactUs(updatedRecord: ContactResponse) {
    return this.http.post<ContactResponse>(`${this.API}/updateContactUs`, updatedRecord);
  }

   replyEmail(user: EmailResponse) {
    return this.http.post<EmailResponse>(`${this.EMAIL_API}/reply-email`, user, { responseType: 'text' } as any);
  }
}
