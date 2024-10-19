// navbar.component.ts
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  authService = inject(AuthService);

  menus = [
    { path: 'budget/item-entry', title: 'Entry' },
    { path: 'budget/item-add', title: 'Add' },
    { path: 'budget/item-approval', title: 'Approval' }

  ];
  
  // add onLogout
  onLogout(): void {
    this.authService.logout();
  }
}
