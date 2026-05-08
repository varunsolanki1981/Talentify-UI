import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-viewpartner',
  standalone: false,
  templateUrl: './viewpartner.html',
  styleUrl: './viewpartner.css',
})
export class Viewpartner {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  getTimeAgo(date: string): string {
  const now = new Date().getTime();
  const created = new Date(date).getTime();
  const diff = Math.floor((now - created) / 1000);

  const days = Math.floor(diff / 86400);
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor(diff / 60);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} min ago`;
  return 'Just now';
}
}
