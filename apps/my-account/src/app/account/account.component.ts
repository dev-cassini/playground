import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  private readonly authService = inject(AuthService);

  identityClaims: Record<string, unknown> | null = null;
  accessTokenClaims: Record<string, unknown> | null = null;
  clientId: string | null = null;

  ngOnInit(): void {
    this.identityClaims = this.authService.getIdentityClaims();
    this.accessTokenClaims = this.authService.getAccessTokenClaims();
    this.clientId = this.extractClientId();
  }

  private extractClientId(): string | null {
    if (!this.accessTokenClaims) return null;
    // Check common claim names for client ID
    return (this.accessTokenClaims['client_id'] as string)
      || (this.accessTokenClaims['azp'] as string)
      || null;
  }

  logout(): void {
    this.authService.logout();
  }

  getClaimKeys(claims: Record<string, unknown> | null): string[] {
    return claims ? Object.keys(claims) : [];
  }

  formatValue(value: unknown): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    if (typeof value === 'number' && this.isTimestamp(value)) {
      return new Date(value * 1000).toLocaleString();
    }
    return String(value);
  }

  private isTimestamp(value: number): boolean {
    // Check if the number looks like a Unix timestamp (between year 2000 and 2100)
    return value > 946684800 && value < 4102444800;
  }
}
