import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, pipes, etc
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent,CommonModule], 
  templateUrl: './app.component.html',
  template: `<router-outlet></router-outlet>`,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
   private router = inject(Router);
  
  mostrarNavbar: boolean = false;

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      
      const url = event.urlAfterRedirects || event.url;
      
      // Si es login, ocultamos. Si no, mostramos.
      this.mostrarNavbar = !url.includes('/login');
      
    });
  }
}