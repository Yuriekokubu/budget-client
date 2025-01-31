// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { LoggedInUser, Tokens, UserProfile } from './models/logged-in-user';
import { ENV_CONFIG } from '../env.config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private envConfig = inject(ENV_CONFIG);
  readonly URL = `${this.envConfig.apiUrl}/auth/login`;
  readonly TOKENS = 'TOKENS'


  httpClient = inject(HttpClient);
  router = inject(Router) 
  
  loggedInUser: LoggedInUser | null = null;

  // add
  constructor() {
    const tokensInStorage = sessionStorage.getItem(this.TOKENS);
    if (tokensInStorage) {
      this.setTokens(JSON.parse(tokensInStorage) as Tokens);
    }
  }

  login(credential: { username: string; password: string }): Observable<Tokens> {
    return this.httpClient
      .post<Tokens>(this.URL, credential)
      .pipe(tap((newToken) => this.setTokens(newToken)));
  }

  setTokens(newToken: Tokens) {
    const userProfile = jwtDecode<UserProfile>(newToken.access_token);
    this.loggedInUser = { tokens: newToken, userProfile };
    sessionStorage.setItem(this.TOKENS, JSON.stringify(newToken)); // add
  }

  logout(): void {
    this.loggedInUser = null;
    this.router.navigate(['/auth/login']);
  }  
}
