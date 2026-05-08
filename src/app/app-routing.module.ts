import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Homecomponent } from './feature/home/homecomponent';
import { Logincomponent } from './feature/auth/login/logincomponent';
import { Authcomponent } from './feature/auth/auth/authcomponent';
import { Registercomponent } from './feature/auth/register/registercomponent';

import { Forgotcomponent } from './feature/auth/forgot/forgotcomponent';
import { Thankscomponent } from './feature/auth/thanks/thankscomponent';
import { Contactus } from './feature/contactus/contactus';
import { Userlist } from './feature/admin/userlist/userlist';
import { Enquiries } from './feature/admin/enquiries/enquiries';
import { ImageUploaderComponent } from './feature/admin/image-uploader/image-uploader.component';
import { Profile } from './feature/auth/profile/profile';
import { Corporatecomponent } from './feature/partnership/corporatecomponent/corporatecomponent';
import { Engagewithgovcomponent } from './feature/partnership/engagewithgovcomponent/engagewithgovcomponent';
import { Institutionalcomponent } from './feature/partnership/institutionalcomponent/institutionalcomponent';
import { Aboutuscomponent } from './feature/commonpages/aboutuscomponent/aboutuscomponent';
import { BoardOfTrustees } from './feature/commonpages/board-of-trustees/board-of-trustees';
import { Missionandvision } from './feature/commonpages/missionandvision/missionandvision';
import { Education } from './feature/whatwedo/education/education';
import { Health } from './feature/whatwedo/health/health';
import { Livelihood } from './feature/whatwedo/livelihood/livelihood';
import { Recordcrud } from './feature/partnership/recordcrud/recordcrud';
import { Donation } from './feature/donation/donation/donation';
import { Donorlist } from './feature/donation/donorlist/donorlist';
import { Dashboard } from './feature/admin/dashboard/dashboard';
import { Becomepartner } from './feature/partnership/becomepartner/becomepartner';
import { Partneradmin } from './feature/admin/partneradmin/partneradmin';
import { Dashboardhighchart } from './feature/dashboardhighchart/dashboardhighchart';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: Homecomponent,
    pathMatch: 'full'
  }, {
    path: 'auth',
    component: Authcomponent,
    children: [
      {
        path: 'login', // Full path will be /auth/login
        component: Logincomponent,
      }, {
        path: 'register',
        component: Registercomponent
      }, {
        path: 'contactus',
        component: Contactus,
      }, {
          path: 'donation',
          component: Donation,
        },
    ],
  }, {
    path: '', // If someone just types /auth, send them to /auth/login
    redirectTo: 'home',
    pathMatch: 'full',
  }, {
    path: 'forgot',
    component: Forgotcomponent,
  }, {
    path: 'thanks',
    component: Thankscomponent,
  }, {
    path: 'userlist',
    component: Userlist,
     data: { breadcrumb: 'User List' }
  }, {
    path: 'enquiries',
    component: Enquiries,
    data: { breadcrumb: 'Enquiries' }
  }, {
    path: 'images',
    component: ImageUploaderComponent,
    data: { breadcrumb: 'Image Uploader' }

  }, {
    path: 'profile',
    component: Profile,
    data: { breadcrumb: 'Profile' }

  }, {
    path: 'corporate',
    component: Corporatecomponent,
    data: { breadcrumb: 'Corporate' }
  }, {
    path: 'engagement',
    component: Engagewithgovcomponent,
    data: { breadcrumb: 'Engagement with Government' }

  }, {
    path: 'institutional',
    component: Institutionalcomponent,
    data: { breadcrumb: 'Institutional' }

  }, {
    path: 'aboutus',
    component: Aboutuscomponent,
    data: { breadcrumb: 'About Us' }

  }, {
    path: 'board-of-trustees',
    component: BoardOfTrustees,
    data: { breadcrumb: 'Board of Trustees' }
  }, {
    path: 'mission-and-vision',
    component: Missionandvision,
    data: { breadcrumb: 'Mission and Vision' }

  }, {
    path: 'education',
    component: Education,
    data: { breadcrumb: 'Education' }

  }, {
    path: 'education',
    component: Education,
    data: { breadcrumb: 'Education' }
  }, {
    path: 'health',
    component: Health,
    data: { breadcrumb: 'Health' }

  }, {
    path: 'health',
    component: Health,
    data: { breadcrumb: 'Health' }

  }, {
    path: 'livelihood',
    component: Livelihood,
    data: { breadcrumb: 'Livelihood' }
  }, {
    path: 'record-crud',
    component: Recordcrud,
    data: { breadcrumb: 'Record Cards' }

  }, {
    path: 'donation',
    component: Donation,
    data: { breadcrumb: 'Donation' }

  }, {
    path: 'donorlist',
    component: Donorlist,
    data: { breadcrumb: 'Donor List' }

  } ,{
    path: 'dashboard',
    component: Dashboard,
    data: { breadcrumb: 'Dashboard' }

  }, {
    path: 'becomepartner',
    component: Becomepartner,
    data: { breadcrumb: 'Become a Partner' }

  }, {
    path: 'partneradmin',
    component: Partneradmin,
    data: { breadcrumb: 'Partner List' }

  } , {
    path: 'dashboardhighchart',
    component: Dashboardhighchart,
    data: { breadcrumb: 'Partner List' }

  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
