import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, LoginResponse, RegisterRequest, ContactResponse } from '../models/user.interface';
import {
  BehaviorSubject,
  Observable,
  tap,
  switchMap,
  catchError,
  throwError,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { ForgotPwdResponse } from '../models/forgot-pwd-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  // THE PRIVATE BOARD (Writeable by AuthService only)
  private userSubject = new BehaviorSubject<User | null>(this.getProfileFromStorage());

    // THE PUBLIC VIEW (Read-only by all other components)
  user$: Observable<User | null> = this.userSubject.asObservable();

   private tokenKey = 'accessToken'; // Key for storing the token in sessionStorage

  // 💡 Define API URLs (relative paths, expecting a Base URL to be prepended later)
  // 'readonly' ensures these URL strings can only be assigned once and never changed after construction.
  private readonly REGISTER_URL = '/auth/register';
  private readonly LOGIN_URL = '/auth/login';
  private readonly ME_URL = '/auth/me';
  private readonly GET_ALL_USERS_URL = '/auth/users';
  private readonly FORGOT_PWD_URL = '/auth/forgot-password';
  private readonly CONTACT_URL = '/auth/contactus';


  constructor(private http: HttpClient) {
    this.loadUserProfileOnStartup();
  }

   // Retrieve the profile from storage (on app initialization/refresh)
  private getProfileFromStorage(): User | null {
    const profileJson = window.sessionStorage.getItem(this.tokenKey);
    return profileJson ? JSON.parse(profileJson) : null;
  }

  // Public getter to access the current value synchronously
  public get currentUserValue(): User | null {
    return this.userSubject.getValue(); // Or this._currentUser.value;
  }

  // --- Core Authentication Methods ---

  register(userData: RegisterRequest): Observable<RegisterRequest> {
    const url = `${this.baseUrl}${this.REGISTER_URL}`;
    // ⬇️ This is our first API call!
    // http.post<User>(URL, DATA) sends a POST request to the URL.
    // The <User> in angle brackets tells TypeScript the expected shape of the successful response.
    console.log('Registering user with data:', userData);
    return this.http.post<RegisterRequest>(url, userData);
  }

  login(credentials: any): Observable<User> {
    const url = `${this.baseUrl}${this.LOGIN_URL}`;
    return this.http.post<LoginResponse>(url, credentials).pipe(
      // 1. Tap: Perform a side action (like saving the Key Card to storage) WITHOUT changing the data flow.
      tap((response) => {
        window.sessionStorage.setItem(this.tokenKey, response.accessToken);
      }),
      // 2. SwitchMap: Throw away the Login Response and immediately start a NEW action: fetching the full User Profile.
      switchMap(() => 
        {
          return this.http.get<User>(`${this.baseUrl}${this.ME_URL}`);
        }),
      // 3. Tap: Use the final 'User' profile to update the central state (Bulletin Board).
      tap((user) => {
        // .next(value): This is the command to publish the new 'user' data to the userSubject.
        // Any component subscribed to user$ instantly gets this new value!
        this.userSubject.next(user);
      })
    );
  }

  private loadUserProfileOnStartup(): void {
    const token = window.sessionStorage.getItem(this.tokenKey);
    if (token) {
      // If a token exists, try to refresh the user profile. If the token is bad, logout.
      this.http.get<User>(this.ME_URL).subscribe({
        // next: Runs on success. Updates the bulletin board with the user data.
        next: (user) => this.userSubject.next(user),
        // error: Runs on failure (e.g., bad/expired token). Forces a logout.
        error: () => this.logout(),
      });
      console.log('User profile loaded on startup from token:', this.userSubject);
    }
  }

  getAllUsers(): Observable<User[]> {
    const url = `${this.baseUrl}${this.GET_ALL_USERS_URL}`;
    return this.http.get<User[]>(url).pipe(
      catchError((error) => {
        let errorMessage = 'An unknown error occured';
        if (error.status === 403) {
          errorMessage = 'Access Denied: Admin permissions required.'; //
        }
        // Pass the cleaned-up message back to the component
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): void {
    // 1. Clear the bulletin board
    this.userSubject.next(null);
    // 2. Remove the security key (Key Card) from storage
    window.sessionStorage.removeItem(this.tokenKey);
  }

  // Tells the Guard (Bouncer) if someone is logged in
  // 👇 Note on the getter and !! operator:
  // 'get' allows calling this as a property (authService.isAuthenticated) for cleaner code.
  // '!!' converts the current userSubject.value (which is a User object or null)
  // into a definitive boolean (User object becomes TRUE, null becomes FALSE).
  get isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }


  forgotPwd(user: ForgotPwdResponse) {
     const url = `${this.baseUrl}${this.FORGOT_PWD_URL}`;
    return this.http.post<ForgotPwdResponse>(url, user);
  }

   contactus(user: ContactResponse) {
     const url = `${this.baseUrl}${this.CONTACT_URL}`;
    return this.http.post<ContactResponse>(url, user);
  }
}
