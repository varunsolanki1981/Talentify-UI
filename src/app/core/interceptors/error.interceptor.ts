import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        let message = 'Something went wrong';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          message = error.error.message;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              message = error.error?.message || 'Bad Request';
              break;
            case 401:
              message = 'Unauthorized - Please login';
              break;
            case 403:
              message = 'Access Denied';
              break;
            case 404:
              message = 'API Not Found';
              break;
            case 500:
              message = 'Internal Server Error';
              break;
            default:
              message = error.error?.message || `Error ${error.status}`;
          }
        }

        // 🔥 Show snackbar
        this.snackBar.open(message, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });

        // 🔥 Optional: log to external service
        console.error('API Error:', error);

        return throwError(() => error);
      })
    );
  }
}