import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  // Dépendances
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef)

  // Change l'état du bouton submit
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // Création formulaire
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  // Logique formulaire
  onSubmit(): void {
    if (this.loginForm.invalid || this.loading()){
      this.loginForm.markAllAsTouched();
      return;
    } 

    // Récup valeur formulaire = LoginRequestDto
    const dto = this.loginForm.getRawValue();

    this.authService.login(dto).pipe(
      finalize(() => {
        // Reset toujours loading
        this.loading.set(false);
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.cdr.markForCheck();
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage.set('Email ou mot de passe incorrect');
        }
        this.loginForm.markAllAsTouched();
        this.cdr.markForCheck();
      }})
  }

  goRegister() {
    this.router.navigate(['/new-account']);
  }
}
