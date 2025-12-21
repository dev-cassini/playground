import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

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
        private authService: AuthService,
        private router: Router
    ) {
        this.signUpForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            ]]
        });
    }

    get email() {
        return this.signUpForm.get('email');
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

        const { email, password } = this.signUpForm.value;

        this.authService.signUp({ email, password }).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                if (response.success) {
                    this.successMessage = 'Account created successfully! Redirecting...';
                    this.signUpForm.reset();
                    // Redirect after 2 seconds
                    setTimeout(() => {
                        // You can redirect to a success page or login page
                        // this.router.navigate(['/success']);
                    }, 2000);
                } else {
                    this.errorMessage = response.message || 'Failed to create account. Please try again.';
                }
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
