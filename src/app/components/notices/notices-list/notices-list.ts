import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-notices',
  imports: [CommonModule, RouterModule],
  templateUrl: './notices-list.html',
  styleUrl: '../notices.css',
})
export class NoticesList {
  constructor(private router: Router, private location: Location) {}

  seeNotice(id: number) {
    this.router.navigate(['/notices', id]);
  }

  goBack() {
    this.location.back();
  }
}
