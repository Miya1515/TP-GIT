import { Injectable, signal } from '@angular/core';
import { AuthResponse } from '../models/models';

/** Session utilisateur : mêmes clés localStorage que le frontend d'origine (token, role, nom, email). */
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly token = signal<string | null>(localStorage.getItem('token'));
  readonly role = signal<string | null>(localStorage.getItem('role'));
  readonly nom = signal<string | null>(localStorage.getItem('nom'));
  readonly email = signal<string | null>(localStorage.getItem('email'));

  setSession(data: AuthResponse): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('nom', data.nom);
    localStorage.setItem('email', data.email);
    this.token.set(data.token);
    this.role.set(data.role);
    this.nom.set(data.nom);
    this.email.set(data.email);
  }

  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('nom');
    localStorage.removeItem('email');
    this.token.set(null);
    this.role.set(null);
    this.nom.set(null);
    this.email.set(null);
  }
}
