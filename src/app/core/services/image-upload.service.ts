import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Image } from '../models/user.interface';

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  // Adjust this URL to your Spring Boot endpoint

  private imagesSubject = new BehaviorSubject<string[]>([]);
  public images$ = this.imagesSubject.asObservable();
  private readonly baseUrl = environment.apiUrl;
  private uploadUrl = '/admin/image/upload' ;
  private listUrl = '/admin/image/getAllImages';
  private deleteUrl = '/admin/image/delete';

  constructor(private http: HttpClient) {}

  uploadImage(file: File, title?: string, description?: string): Observable<any> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    if (title) fd.append('title', title);
    if (description) fd.append('description', description);
    const url = `${this.baseUrl}${this.uploadUrl}`;
    return this.http.post(url, fd, { reportProgress: true, observe: 'events', responseType: 'text'})
      .pipe(map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percent = event.total ? Math.round(100 * event.loaded / event.total) : Math.round(event.loaded);
          return { type: 'progress', loaded: percent };
        } else if (event.type === HttpEventType.Response) {
          return { type: 'complete', body: event.body };
        }
        return { type: 'other' };
      }));
  }

  // getUploadedImages(): Observable<any> {
  //   const url = `${this.baseUrl}${this.listUrl}`;
  //   return this.http.get(url);
  // }

  getUploadedImages(): Observable<Image[]> {
    const url = `${this.baseUrl}${this.listUrl}`;
    return this.http.get<Image[]>(url);
  }

  deleteImage(idOrName: string): Observable<any> {
    const url = `${this.baseUrl}${this.deleteUrl}/${encodeURIComponent(idOrName)}`;
    return this.http.delete<any>(url, { responseType: 'text' } as any);
  }
}
