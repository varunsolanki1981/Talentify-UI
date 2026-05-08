import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreadcrumbService } from '../../../core/services/breadcrumbService';


@Component({
  selector: 'app-breadcrumb',
  standalone: false,
  templateUrl: './breadcrumbcomponent.html',
  styleUrl: './breadcrumbcomponent.css',
})
export class Breadcrumbcomponent {

  breadcrumbs: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        console.log(this.route.root.snapshot);
        this.breadcrumbs = this.breadcrumbService.getBreadcrumbs(this.route.root.snapshot);
      });
  }

}
