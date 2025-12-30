import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-landing',
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  private readonly authService = inject(AuthService);

  get userEmail(): string {
    const profile = this.authService.getUserProfile();
    return (profile?.['email'] as string) || '';
  }

  logout(): void {
    this.authService.logout();
  }
}
