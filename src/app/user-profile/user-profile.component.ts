import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';

interface User {
  _id: string;
  username: string;
  email: string;
  birthday: string;
  favoriteMovies: string[];
  token: string;
}

interface Movie {
  _id: string;
  title: string;
  imagePath: string;
}

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
  user: User;
  favoriteMovies: Movie[] = [];

  constructor(
    private fetchApiData: FetchApiDataService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.user = this.getUserFromStorage();
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUserFromStorage(): User {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : ({} as User);
  }

  getUser(): void {
    this.fetchApiData.getUser(this.user.username).subscribe({
      next: (res: User) => {
        this.user = { ...res, token: this.user.token };
        this.updateLocalStorage();
        this.getFavoriteMovies();
      },
      error: (error) => this.handleError(error, 'Failed to fetch user data'),
    });
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.user.username, this.user).subscribe({
      next: (res: User) => {
        this.user = { ...res, token: this.user.token };
        this.updateLocalStorage();
        this.showSnackBar('User updated successfully');
      },
      error: (error) => this.handleError(error, 'Failed to update user'),
    });
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getFavouriteMovies(this.user.username).subscribe({
      next: (res: Movie[]) => {
        this.favoriteMovies = res;
      },
      error: (error) =>
        this.handleError(error, 'Failed to fetch favorite movies'),
    });
  }

  removeFromFavorite(movieId: string): void {
    this.fetchApiData
      .deleteFavouriteMovie(this.user.username, movieId)
      .subscribe({
        next: (res: User) => {
          this.user.favoriteMovies = res.favoriteMovies;
          this.updateLocalStorage();
          this.getFavoriteMovies();
          this.showSnackBar('Movie removed from favorites');
        },
        error: (error) =>
          this.handleError(error, 'Failed to remove movie from favorites'),
      });
  }

  resetUser(): void {
    this.user = this.getUserFromStorage();
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['welcome']);
  }

  backToMovies(): void {
    this.router.navigate(['movies']);
  }

  private updateLocalStorage(): void {
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 2000 });
  }

  private handleError(error: any, message: string): void {
    console.error(error);
    this.showSnackBar(message);
  }
}
