import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logInUser(): void {
    console.log('User data:', this.userData); // Log user data
    this.fetchApiData.userLogin(this.userData).subscribe({
      next: (res) => {
        this.dialogRef.close();
        this.snackBar.open(
          `Login success, Welcome ${res.user.Username}`,
          'OK',
          {
            duration: 2000,
          }
        );
        let user = {
          id: res.user._id,
          Username: res.user.Username,
          birthday: res.user.birthday,
          email: res.user.email,
        };
        // Store user and token separately
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', res.token);

        // Navigate to the movies page after successful login
        this.router.navigate(['/movies']);
      },
      error: (err) => {
        console.error('Login error:', err); // Log the complete error response
        this.snackBar.open('Login fail', 'OK', {
          duration: 2000,
        });
      },
    });
  }
}
