import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userData: any = {};
  favoriteMovies: any[] = [];

  constructor(public fetchApiData: FetchApiDataService, public router: Router) {
    this.userData = JSON.parse(localStorage.getItem('user') || '{}');
  }

  ngOnInit(): void {
    this.getUser();
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData.username, this.userData).subscribe(
      (res: any) => {
        this.userData = {
          ...res,
          id: res._id,
          password: this.userData.password,
          token: this.userData.token,
        };
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.getFavoriteMovies();
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  resetUser(): void {
    this.userData = JSON.parse(localStorage.getItem('user') || '{}');
  }

  backToMovies(): void {
    this.router.navigate(['movies']);
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies(this.userData.username).subscribe(
      (res: any) => {
        this.favoriteMovies = res;
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  getUser(): void {
    this.fetchApiData.getUser(this.userData.username).subscribe((res: any) => {
      this.userData = {
        ...res,
        id: res._id,
        password: this.userData.password,
        token: this.userData.token,
      };
      localStorage.setItem('user', JSON.stringify(this.userData));
      this.getFavoriteMovies();
    });
  }

  removeFromFavorite(movieId: string): void {
    this.fetchApiData
      .deleteFavoriteMovies(this.userData.username, movieId)
      .subscribe(
        (res: any) => {
          this.userData.favoriteMovies = res.favoriteMovies;
          this.getFavoriteMovies();
        },
        (err: any) => {
          console.error(err);
        }
      );
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
  }
}
