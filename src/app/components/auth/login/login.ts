import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../core/services/token-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _tokenService = inject(TokenService);
  private _cdr = inject(ChangeDetectorRef)

  loading = false;
  errorMessage = '';

  loginForm = this._fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading){
      this.loginForm.markAllAsTouched();
      return;
    } 
    console.log(this.loginForm.value);

    this.errorMessage = '';
    this.loading = true;
    const dto = this.loginForm.getRawValue();

    this._authService.login(dto).pipe(
      finalize(() => {
        this.loading = false;
        this._cdr.markForCheck();
      })
    ).subscribe({
      next: (res) => {

        this._tokenService.set(res.token);
        this._cdr.markForCheck();
        this._router.navigateByUrl('/');
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (err.status === 0) {
          this.errorMessage = "Impossible de contacter l'API (CORS / URL / serveur)";
        } else {
          this.errorMessage = `Erreur serveur (${err.status})`;
        }
        this.loginForm.markAllAsTouched();
        this._cdr.markForCheck();
      }})
  }
}
