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
      const isCallback = window.location.pathname.includes('/callback');

      await this.oauthService.loadDiscoveryDocumentAndTryLogin();

      if (this.oauthService.hasValidAccessToken() && !isCallback) {
        // Quick session validation - wait up to 1 second for response
        const isSessionValid = await this.quickSessionCheck();
        if (!isSessionValid) {
          this.oauthService.logOut();
          return false;
        }

        // Set up automatic silent refresh for token expiry
        this.oauthService.setupAutomaticSilentRefresh();
      }

      return this.oauthService.hasValidAccessToken();
    } catch (error) {
      console.error('OAuth initialization failed:', error);
      return false;
    }
  }

  private async quickSessionCheck(): Promise<boolean> {
    // Race between silent refresh and a short timeout
    // If session is invalid, IdP responds quickly with error
    // If valid or slow, assume valid and proceed
    const timeoutPromise = new Promise<boolean>(resolve =>
      setTimeout(() => resolve(true), 1000)
    );

    const refreshPromise = this.oauthService.silentRefresh()
      .then(() => true)
      .catch(() => false);

    return Promise.race([refreshPromise, timeoutPromise]);
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

  getUserProfile(): Record<string, unknown> | null {
    const claims = this.oauthService.getIdentityClaims();
    return claims ? claims as Record<string, unknown> : null;
  }
}
