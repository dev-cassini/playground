import { inject, Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly oauthService = inject(OAuthService);

  constructor() {
    this.configureOAuth();
  }

  private configureOAuth(): void {
    const authConfig: AuthConfig = {
      issuer: environment.stsUrl,
      redirectUri: environment.redirectUri,
      postLogoutRedirectUri: environment.postLogoutRedirectUri,
      clientId: environment.clientId,
      scope: environment.scope,
      responseType: 'code',
      showDebugInformation: !environment.production,
      requireHttps: environment.production,
    };

    this.oauthService.configure(authConfig);
  }

  async initializeAuth(): Promise<boolean> {
    try {
      await this.oauthService.loadDiscoveryDocumentAndTryLogin();
      return this.oauthService.hasValidAccessToken();
    } catch (error) {
      console.error('OAuth initialization failed:', error);
      return false;
    }
  }

  login(): void {
    this.oauthService.initCodeFlow();
  }

  logout(): void {
    this.oauthService.logOut();
  }

  hasValidToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }

  getIdToken(): string {
    return this.oauthService.getIdToken();
  }

  getIdentityClaims(): Record<string, unknown> | null {
    const claims = this.oauthService.getIdentityClaims();
    return claims ? claims as Record<string, unknown> : null;
  }

  getAccessTokenClaims(): Record<string, unknown> | null {
    const token = this.oauthService.getAccessToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}
