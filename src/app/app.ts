import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cursitu');

  menuOpen = false;

  toggleMenu() {
     this.menuOpen = !this.menuOpen;
  }
}
