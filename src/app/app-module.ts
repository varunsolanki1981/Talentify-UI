import { CUSTOM_ELEMENTS_SCHEMA, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxImageSliderModule } from "ngx-image-slider";
import { provideHighcharts } from 'highcharts-angular';


import { AgGridAngular } from 'ag-grid-angular';
import { Angular2ImageGalleryModule } from 'angular2-image-gallery';

import { AppComponent } from './app.component';
import { Homecomponent } from './feature/home/homecomponent';
import { CommonModule, DatePipe, NgOptimizedImage, provideImgixLoader } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { Logincomponent } from './feature/auth/login/logincomponent';


import { Registercomponent } from './feature/auth/register/registercomponent';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { Forgotcomponent } from './feature/auth/forgot/forgotcomponent';
import { Thankscomponent } from './feature/auth/thanks/thankscomponent';
import { Contactus } from './feature/contactus/contactus';
import { Userlist } from './feature/admin/userlist/userlist';
import { Enquiries } from './feature/admin/enquiries/enquiries';
import { ActionRendererComponent } from './renderers/action-renderer-component/action-renderer-component';
import { ConfirmdialogComponent } from './renderers/confirmdialog-component/confirmdialog-component';
import { EmailComponent } from './feature/admin/email-component/email-component';
import { EmailIconRendererComponent } from './renderers/email-icon-renderer-component/email-icon-renderer-component';
import { EmailModalRendererComponent } from './renderers/email-modal-renderer-component/email-modal-renderer-component';
import { ImageUploaderComponent } from './feature/admin/image-uploader/image-uploader.component';
import { DeleteConfirmDialogComponent } from './feature/admin/image-uploader/delete-confirm-dialog.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { Profile } from './feature/auth/profile/profile';
import { Corporatecomponent } from './feature/partnership/corporatecomponent/corporatecomponent';
import { Institutionalcomponent } from './feature/partnership/institutionalcomponent/institutionalcomponent';
import { Engagewithgovcomponent } from './feature/partnership/engagewithgovcomponent/engagewithgovcomponent';
import { Aboutuscomponent } from './feature/commonpages/aboutuscomponent/aboutuscomponent';
import { BoardOfTrustees } from './feature/commonpages/board-of-trustees/board-of-trustees';
import { Missionandvision } from './feature/commonpages/missionandvision/missionandvision';
import { Education } from './feature/whatwedo/education/education';
import { Health } from './feature/whatwedo/health/health';
import { Livelihood } from './feature/whatwedo/livelihood/livelihood';
import { Recordcrud } from './feature/partnership/recordcrud/recordcrud';
import { ConfirmDialogRecordCrud } from './feature/partnership/recordcrud/ConfirmDialogRecordCrud';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { Donation } from './feature/donation/donation/donation';
import { Donorlist } from './feature/donation/donorlist/donorlist';
import { Dashboard } from './feature/admin/dashboard/dashboard';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Becomepartner } from './feature/partnership/becomepartner/becomepartner';
import { Partneradmin } from './feature/admin/partneradmin/partneradmin';
import { Rejectdialog } from './feature/admin/partneradmin/rejectdialog/rejectdialog';
import { Viewpartner } from './feature/admin/partneradmin/viewpartner/viewpartner';
import { Backup } from './feature/admin/backup/backup';
import { BreadcrumbService } from './core/services/breadcrumbService';
import { Breadcrumbcomponent } from './feature/commonpages/breadcrumbcomponent/breadcrumbcomponent';
import { HighchartsChartComponent } from 'highcharts-angular';
import { Dashboardhighchart } from './feature/dashboardhighchart/dashboardhighchart';


@NgModule({
  declarations: [
    AppComponent,
    Homecomponent,
    Logincomponent,
    Userlist,
    Registercomponent,
    Forgotcomponent,
    Thankscomponent,
    Contactus,
    Enquiries,
    ActionRendererComponent,
    ConfirmdialogComponent,
    EmailComponent,
    EmailIconRendererComponent,
    EmailModalRendererComponent,
    ImageUploaderComponent,
    DeleteConfirmDialogComponent,
    Profile,
    Corporatecomponent,
    Institutionalcomponent,
    Engagewithgovcomponent,
    Aboutuscomponent,
    BoardOfTrustees,
    Missionandvision,
    Education,
    Health,
    Livelihood,
    Recordcrud,
    ConfirmDialogRecordCrud,
    Donation,
    Donorlist,
    Dashboard,
    Becomepartner,
    Partneradmin,
    Rejectdialog,
    Viewpartner,
    Backup,
    Breadcrumbcomponent,
    Dashboardhighchart

  ],
  imports: [
     BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    RouterOutlet,
    NgxImageSliderModule.forRoot(),
    AgGridAngular,
    NgOptimizedImage,
    HammerModule,
    Angular2ImageGalleryModule,
    NgImageSliderModule,
    BaseChartDirective,
    HighchartsChartComponent,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(), 
//     provideHighcharts({
//     instance: () =>
//     import('highcharts/esm/highcharts').then((m) => {
//         const Highcharts = m.default;

//         // Allow custom attributes
//         Highcharts.AST.allowedAttributes.push('custom-attribute');

//         // Allow custom elements
//         Highcharts.AST.allowedTags.push('my-custom-tag');

//         return Highcharts;
//     }),
// }),
    provideHighcharts({
      // Optional: Define the Highcharts instance dynamically
      instance: () => import('highcharts'),
      // Include Highcharts additional modules (e.g., exporting, accessibility) or custom themes
      modules: () => {
        return [
          import('highcharts/esm/modules/accessibility'),
          import('highcharts/esm/modules/exporting'),
          import('highcharts/esm/themes/sunset'),
        ];
      },
    }),
    DatePipe,
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideCharts(withDefaultRegisterables()),
    provideImgixLoader('http://localhost:8080/userapi/'),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
