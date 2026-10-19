import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ShopComponent } from './pages/shop/shop.component';

export const routes: Routes = [
  { path: '', component: ShopComponent, title: 'ShopEasy - Boutique en ligne' },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard], title: 'ShopEasy - Admin Panel' },
  { path: 'login', component: LoginComponent, title: 'Login - Miya Cosmetics' },
  { path: 'register', component: RegisterComponent, title: 'Register - Miya Cosmetics' },
  // Anciennes URLs des pages HTML
  { path: 'index.html', redirectTo: '', pathMatch: 'full' },
  { path: 'admin.html', redirectTo: 'admin', pathMatch: 'full' },
  { path: 'login.html', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register.html', redirectTo: 'register', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
