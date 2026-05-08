import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {

  constructor(private router: Router) {}

  getBreadcrumbs(
  route: ActivatedRouteSnapshot,
  url: string = '',
  breadcrumbs: { label: string; url: string }[] = []
): { label: string; url: string }[] {

  const children: ActivatedRouteSnapshot[] = route.children;
  //console.log('Current Route:', route);
  //console.log('Children Routes:', children);
  if (children.length === 0) {
    return breadcrumbs;
  }

  for (const child of children) {
    const routeURL = child.url.map(segment => segment.path).join('/');

    console.log('Processing child route:', routeURL);
    if (routeURL !== '') {
      url += `/${routeURL}`;
    }

    const label = child.data['breadcrumb'];

    if (label) {
      breadcrumbs.push({ label, url });
    }

    return this.getBreadcrumbs(child, url, breadcrumbs);
  }
console.log('Breadcrumbs:', breadcrumbs);
  return breadcrumbs;
}
}