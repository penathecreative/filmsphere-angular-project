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

  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        this.dialogRef.close();

        // Store user object (including token) in localStorage
        const user = {
          id: result.user._id,
          Username: result.user.Username,
          birthday: result.user.birthday,
          email: result.user.email,
          token: result.token,
        };
        localStorage.setItem('user', JSON.stringify(user));

        this.snackBar.open(user.Username + ' successfully logged in', 'OK', {
          duration: 4000,
        });
        this.router.navigate(['movies']);
      },
      (error) => {
        console.error('Login error:', error);
        this.snackBar.open('Login failed', 'OK', {
          duration: 4000,
        });
      }
    );
  }
}
