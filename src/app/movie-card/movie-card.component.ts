import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Observer } from 'rxjs';
import { Movie } from '../models';
import { DialogComponent } from '../dialog/dialog.component';
import { Router, RouterModule } from '@angular/router';

// If not already defined
interface User {
  _id: string;
  username: string;
  email: string;
  birthday: string;
  favoriteMovies: string[];
  token: string;
}

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: any[] = [];
  currentUser: string = '';

  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('MovieCardComponent constructor called');
  }

  ngOnInit(): void {
    console.log('MovieCardComponent ngOnInit called');
    this.getMovies();
    this.getUserFromStorage();
  }
  getUserFromStorage(): User | undefined {
    console.log('getUserFromStorage method called');

    if (typeof window !== 'undefined') {
      console.log('Is platform browser:', typeof window !== 'undefined');

      const userString = localStorage.getItem('user');
      console.log('Attempting to get user from localStorage');
      console.log('userString:', userString);

      if (userString) {
        try {
          const user: User = JSON.parse(userString);
          console.log('Parsed user:', user);
          return user;
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
        }
      } else {
        console.warn('No user found in localStorage');
      }
    } else {
      console.warn('Not running in a browser, localStorage not available');
    }
    return undefined;
  }

  getMovies(): void {
    console.log('getMovies method called');
    const observer: Observer<any> = {
      next: (movies: any) => {
        this.movies = movies;
        console.log('Movies fetched:', this.movies.length);
      },
      error: (error: any) => {
        console.error('Error fetching movies:', error);
        this.snackBar.open('Error fetching movies', 'OK', {
          duration: 4000,
        });
      },
      complete: () => {
        console.log('getMovies observable completed');
      },
    };
    this.fetchApiData.getAllMovies().subscribe(observer);
  }

  getFavoriteMovies(): void {
    console.log('getFavoriteMovies method called');
    if (isPlatformBrowser(this.platformId) && this.currentUser) {
      const observer: Observer<any> = {
        next: (favoriteMovies: any) => {
          this.favoriteMovies = favoriteMovies;
          console.log('Favorite movies fetched:', this.favoriteMovies.length);
        },
        error: (error: any) => {
          console.error('Error fetching favorite movies:', error);
          this.snackBar.open('Error fetching favorite movies', 'OK', {
            duration: 4000,
          });
        },
        complete: () => {
          console.log('getFavoriteMovies observable completed');
        },
      };
      this.fetchApiData.getFavoriteMovies(this.currentUser).subscribe(observer);
    } else {
      console.log(
        'Not in browser or no current user, skipping favorite movies fetch'
      );
      this.favoriteMovies = [];
    }
  }

  toggleFavorite(movieId: string): void {
    console.log('toggleFavorite method called for movie:', movieId);
    if (isPlatformBrowser(this.platformId) && this.currentUser) {
      const observer: Observer<any> = {
        next: () => {
          const action = this.favoriteMovies.includes(movieId)
            ? 'removed from'
            : 'added to';
          console.log(`Movie ${action} favorites`);
          this.snackBar.open(`Successfully ${action} favorites`, 'OK', {
            duration: 4000,
          });
          this.getFavoriteMovies();
        },
        error: (error: any) => {
          const action = this.favoriteMovies.includes(movieId)
            ? 'removing from'
            : 'adding to';
          console.error(`Error ${action} favorites:`, error);
          this.snackBar.open(`Error ${action} favorites`, 'OK', {
            duration: 4000,
          });
        },
        complete: () => {
          console.log('toggleFavorite observable completed');
        },
      };

      if (this.favoriteMovies.includes(movieId)) {
        this.fetchApiData
          .deleteFavoriteMovies(this.currentUser, movieId)
          .subscribe(observer);
      } else {
        this.fetchApiData
          .addFavoriteMovies(this.currentUser, movieId)
          .subscribe(observer);
      }
    } else {
      console.warn(
        'Favorite toggling is not available in server-side rendering'
      );
    }
  }

  goToProfile(): void {
    console.log('Navigating to profile');
    this.router.navigate(['/profile']);
  }

  logout(): void {
    console.log('Logout method called');
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      console.log('User data removed from localStorage');
      this.snackBar.open('Successfully logged out', 'OK', {
        duration: 2000,
      });
      this.router.navigate(['/welcome']);
    } else {
      console.warn('Logout not available in server-side rendering');
    }
  }

  showGenre(movie: Movie): void {
    console.log('Showing genre dialog for movie:', movie.Title);
    this.dialog.open(DialogComponent, {
      data: {
        title: `Genre: ${movie.Genre.Name}`,
        content: movie.Genre.Description,
      },
      width: '400px',
    });
  }

  showDirector(movie: Movie): void {
    console.log('Showing director dialog for movie:', movie.Title);
    this.dialog.open(DialogComponent, {
      data: {
        title: `Director: ${movie.Director.Name}`,
        content: movie.Director.Bio,
      },
      width: '400px',
    });
  }

  showDetail(movie: Movie): void {
    console.log('Showing details dialog for movie:', movie.Title);
    this.dialog.open(DialogComponent, {
      data: {
        title: `Title: ${movie.Title}`,
        content: movie.Description,
      },
      width: '400px',
    });
  }
}
