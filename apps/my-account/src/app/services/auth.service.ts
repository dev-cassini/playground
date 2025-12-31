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
      sessionChecksEnabled: true,
      useSilentRefresh: true,
      silentRefreshRedirectUri: environment.postLogoutRedirectUri + '/silent-refresh.html',
    };

    this.oauthService.configure(authConfig);

    // Listen for session termination events
    this.oauthService.events.subscribe(event => {
      if (event.type === 'session_terminated' || event.type === 'session_error') {
        console.log('Session ended, clearing tokens');
        this.oauthService.logOut(true); // noRedirectToLogoutUrl = true, just clear local state
      }
    });
  }

  async initializeAuth(): Promise<boolean> {
    try {
      // Check if we're processing a callback (has code in URL)
      const isCallback = window.location.search.includes('code=') ||
                         window.location.search.includes('iss=');

      await this.oauthService.loadDiscoveryDocumentAndTryLogin();

      // Only attempt silent refresh if we already have a token and NOT processing a callback
      if (this.oauthService.hasValidAccessToken() && !isCallback) {
        try {
          await this.oauthService.silentRefresh();
        } catch {
          // Silent refresh failed - session may have ended
          // Clear local tokens and return false
          this.oauthService.logOut(true);
          return false;
        }
      }

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
