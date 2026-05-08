import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    map(user=>{
      console.log('AdminGuard checking user roles:', user?.roles);
      if(user && user.roles.includes('ROLE_ADMIN')){
        return true;
      }
      // If not admin, kick back to dashboard (default route)
      return router.createUrlTree(['/home']);
    })
  )
}
