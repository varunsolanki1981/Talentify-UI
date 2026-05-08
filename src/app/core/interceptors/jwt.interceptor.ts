import { HttpInterceptorFn } from '@angular/common/http';

// JWT Token Interceptor
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Get the access token from storage (set during login)
  const token = window.sessionStorage.getItem('accessToken');
  if(token){
    // 2. If a token exists, clone the request and add the Authorization header
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    })
    return next(cloned);
  }
  // 3. If no token, just let the original request proceed
  return next(req);
};
