import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignUpResponse {
  success: boolean;
  message?: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://admin-api.falc.local/api';

  signUp(request: SignUpRequest): Observable<SignUpResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<SignUpResponse>(`${this.baseUrl}/users`, {
      email: request.email,
      password: request.password,
      confirmPassword: request.password
    }, { headers });
  }
}
