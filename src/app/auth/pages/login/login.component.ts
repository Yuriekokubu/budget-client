// login.component.ts
import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, AlertModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // router
  router = inject(Router);

  /// auth.service
  authService = inject(AuthService);

  // init form
  fb = inject(NonNullableFormBuilder);
  username = this.fb.control('a1008');
  password = this.fb.control('tae');

  fg = this.fb.group({
    username: this.username,
    password: this.password
  });

  // error
  error?: any;

  onLogin() {
    this.authService.login(this.fg.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => (this.error = error)
    });
  }
}
