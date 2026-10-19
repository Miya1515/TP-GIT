import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

/** Conversion de register.html (version Miya Cosmetics) */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  @ViewChild('nomInput') nomInput?: ElementRef<HTMLInputElement>;

  nom = '';
  email = '';
  password = '';
  confirm = '';
  errorMsg = '';
  successMsg = '';

  // body { background: #fdf6f6; } de la page d'origine
  ngOnInit(): void {
    document.body.style.background = '#fdf6f6';
  }
  ngOnDestroy(): void {
    document.body.style.background = '';
  }
  // attribut "autofocus" de la page d'origine
  ngAfterViewInit(): void {
    this.nomInput?.nativeElement.focus();
  }

  // document.addEventListener('keydown', Enter → doRegister())
  @HostListener('document:keydown.enter')
  onEnter(): void {
    this.doRegister();
  }

  async doRegister(): Promise<void> {
    const nom = this.nom.trim();
    const email = this.email.trim();
    const password = this.password;
    const confirm = this.confirm;
    this.errorMsg = '';
    this.successMsg = '';

    if (!nom || !email || !password || !confirm) {
      this.errorMsg = 'Please complete all fields';
      return;
    }
    if (password !== confirm) {
      this.errorMsg = 'The passwords do not match';
      return;
    }
    if (password.length < 6) {
      this.errorMsg = 'The password is too short (min 6 characters)';
      return;
    }
    try {
      const data = await this.api.register(nom, email, password);
      this.auth.setSession(data);
      this.successMsg = 'Your account has been created successfully! Redirecting...';
      setTimeout(() => this.router.navigateByUrl('/'), 1200);
    } catch (e: any) {
      if (e?.status) {
        const body = e.error;
        const msg = typeof body === 'string' ? body : body ? JSON.stringify(body) : '';
        this.errorMsg = msg || 'An error occurred while creating the account';
      } else {
        this.errorMsg = 'Error connecting to the server';
      }
    }
  }
}
