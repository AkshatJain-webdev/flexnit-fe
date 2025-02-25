import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  AuthService,
  LoginCredentials,
  RegisterCredentials,
} from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AuthComponent {
  form!: FormGroup;
  isLogin = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm(): void {
    const baseForm = {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    };

    // For registration, add the other fields and their validation
    if (!this.isLogin) {
      this.form = this.fb.group(
        {
          ...baseForm,
          confirmPassword: ['', Validators.required],
          age: ['', [Validators.required, Validators.min(13)]],
        },
        { validators: this.passwordMatchValidator }
      );
    } else {
      this.form = this.fb.group(baseForm);
    }
  }

  private passwordMatchValidator(
    form: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  toggleMode(): void {
    this.isLogin = !this.isLogin;
    this.initForm();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    const { confirmPassword, ...credentials } = this.form.value;

    const request = this.isLogin
      ? this.authService.login(credentials as LoginCredentials)
      : this.authService.register(credentials as RegisterCredentials);

    request.subscribe({
      next: () => {
        this.toastr.success(
          this.isLogin ? 'Welcome back!' : 'Registration successful!'
        );
        this.router.navigate(['/content']);
      },
      error: (error) => {
        console.error('err', error.message);
        this.toastr.error(error?.error?.message || 'An error occurred');
        this.isLoading = false;
      },
    });
  }
}
