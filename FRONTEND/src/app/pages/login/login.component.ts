import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

/** Conversion de login.html (version Miya Cosmetics) */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  @ViewChild('emailInput') emailInput?: ElementRef<HTMLInputElement>;

  email = '';
  password = '';
  errorMsg = '';

  // body { background: #fdf6f6; } de la page d'origine
  ngOnInit(): void {
    document.body.style.background = '#fdf6f6';
  }
  ngOnDestroy(): void {
    document.body.style.background = '';
  }
  // attribut "autofocus" de la page d'origine
  ngAfterViewInit(): void {
    this.emailInput?.nativeElement.focus();
  }

  // document.addEventListener('keydown', Enter → doLogin())
  @HostListener('document:keydown.enter')
  onEnter(): void {
    this.doLogin();
  }

  async doLogin(): Promise<void> {
    const email = this.email.trim();
    const password = this.password;
    this.errorMsg = '';

    if (!email || !password) {
      this.errorMsg = 'Please complete all fields';
      return;
    }
    try {
      const data = await this.api.login(email, password);
      this.auth.setSession(data);
      if (data.role === 'ADMIN') {
        this.router.navigateByUrl('/admin');
      } else {
        this.router.navigateByUrl('/');
      }
    } catch (e: any) {
      // réponse HTTP d'erreur → identifiants incorrects ; sinon serveur injoignable
      this.errorMsg = e?.status ? 'The email or password is incorrect' : 'Error connecting to the server';
    }
  }
}
