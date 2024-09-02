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
  user: any = {};
  favoriteMovies: Movie[] = [];
  userData = { Username: '', birthday: '', email: '', token: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    private router: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getFavoriteMovies();
  }

  /**  initializeUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }*/

  /*DgetUser(): void {
    this.fetchApiData.getUser(localStorage.getItem('user') || '').subscribe({
      next: (res: User) => {
        this.user = { ...res, token: this.user.token };
        this.updateLocalStorage();
        this.getFavoriteMovies();
      },
      error: (error) => this.handleError(error, 'Failed to fetch user data'),
    });
  }


  /**
   * Get user details from localStorage
   */

  getUser(): void {
    this.fetchApiData
      .getUser(localStorage.getItem('user') || '')
      .subscribe((resp: any) => {
        this.user = resp;
        return this.user;
      });
  }

  getFavoriteMovies(): void {
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    if (!username) {
      console.error('No user found in localStorage');
      return;
    }

    this.fetchApiData.getFavouriteMovies(username).subscribe({
      next: (resp: any[]) => {
        this.favoriteMovies = resp;
      },
      error: (error) => {
        console.error('Error fetching favorite movies:', error);
        this.snackBar.open('Failed to fetch favorite movies', 'OK', {
          duration: 2000,
        });
      },
    });
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.user.Username, this.userData).subscribe({
      next: (resp: any) => {
        this.snackBar.open('User updated successfully', 'OK', {
          duration: 2000,
        });
        localStorage.setItem('user', resp.username);
        this.getUser();
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.snackBar.open('Failed to update user', 'OK', { duration: 2000 });
      },
    });
  }

  removeFromFavorite(movieId: string): void {
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    this.fetchApiData.deleteFavouriteMovie(username, movieId).subscribe({
      next: (resp: any) => {
        this.snackBar.open('Movie removed from favorites', 'OK', {
          duration: 2000,
        });
        this.getFavoriteMovies();
      },
      error: (error) => {
        console.error('Error removing movie from favorites:', error);
        this.snackBar.open('Failed to remove movie from favorites', 'OK', {
          duration: 2000,
        });
      },
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }

  backToMovies(): void {
    this.router.navigate(['movies']);
  }
}
