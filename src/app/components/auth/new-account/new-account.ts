import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { TokenService } from '../../../core/services/token-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-account',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-account.html',
  styleUrl: './new-account.css',
})
export class NewAccount {

  // Dépendances
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  // Change l'état du bouton submit
  loading = signal(false);

  error = signal<string | null>(null);

  registerForm = this.fb.nonNullable.group({
    displayName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: this.fb.nonNullable.control('', [Validators.required]),
  });

  submit() {
    this.error.set(null);
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.error.set('Formulaire invalide.');
      return;
    }

    const { displayName, email, password, confirmPassword } = this.registerForm.getRawValue();

    if (password !== confirmPassword) {
      this.error.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.loading.set(true);

    this.auth.register({ displayName, email, password }).subscribe({
      next: (res) => {
        this.tokenService.set(res.token);
        this.loading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading.set(false);

        if (err?.status === 409) {
          this.error.set(err?.error?.message ?? 'Email déjà utilisé.');
          return;
        }

        this.error.set('Erreur lors de la création du compte.');
      }
    });
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
