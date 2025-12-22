import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-sign-up',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
    signUpForm: FormGroup;
    isSubmitting = false;
    errorMessage = '';
    successMessage = '';
    showPassword = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        this.signUpForm = this.fb.group({
            emailAddress: ['', [Validators.required, Validators.email]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            ]]
        });
    }

    get emailAddress() {
        return this.signUpForm.get('emailAddress');
    }

    get password() {
        return this.signUpForm.get('password');
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    onSubmit(): void {
        if (this.signUpForm.invalid) {
            this.signUpForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        this.errorMessage = '';
        this.successMessage = '';

        const { emailAddress, password } = this.signUpForm.value;

        this.authService.signUp({ emailAddress, password }).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.successMessage = 'Account created successfully! Redirecting...';
                this.signUpForm.reset();
                setTimeout(() => {
                    window.location.href = environment.portalUrl;
                }, 2000);
            },
            error: (error) => {
                this.isSubmitting = false;
                console.error('Sign up error:', error);

                if (error.status === 0) {
                    this.errorMessage = 'Unable to connect to the server. Please check if IdentityServer is running.';
                } else if (error.error?.message) {
                    this.errorMessage = error.error.message;
                } else if (error.error?.errors) {
                    // Handle validation errors from IdentityServer
                    const errors = Object.values(error.error.errors).flat();
                    this.errorMessage = (errors as string[]).join(' ');
                } else {
                    this.errorMessage = 'An error occurred during sign up. Please try again.';
                }
            }
        });
    }

    getPasswordStrength(): string {
        const password = this.password?.value || '';
        if (password.length === 0) return '';
        if (password.length < 8) return 'weak';

        let strength = 0;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@$!%*?&]/.test(password)) strength++;

        if (strength <= 2) return 'weak';
        if (strength === 3) return 'medium';
        return 'strong';
    }
}
