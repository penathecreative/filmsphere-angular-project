// src/app/movie-card/movie-card.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Observer } from 'rxjs';
import { Movie } from '../models';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.getMovies();
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user) {
        this.currentUser = JSON.parse(user).username;
        this.getFavoriteMovies();
      }
    }
  }

  // get movies
  getMovies(): void {
    const observer: Observer<any> = {
      next: (movies: any) => {
        this.movies = movies;
      },
      error: (error: any) => {
        console.error('Error fetching movies:', error);
        this.snackBar.open('Error fetching movies', 'OK', {
          duration: 4000,
        });
      },
      complete: () => {},
    };
    this.fetchApiData.getAllMovies().subscribe(observer);
  }

  //Get Favorite Movies if that's the case
  getFavoriteMovies(): void {
    if (isPlatformBrowser(this.platformId) && this.currentUser) {
      const observer: Observer<any> = {
        next: (favoriteMovies: any) => {
          this.favoriteMovies = favoriteMovies;
        },
        error: (error: any) => {
          console.error('Error fetching favorite movies:', error);
          this.snackBar.open('Error fetching favorite movies', 'OK', {
            duration: 4000,
          });
        },
        complete: () => {},
      };
      this.fetchApiData.getFavoriteMovies(this.currentUser).subscribe(observer);
    } else {
      this.favoriteMovies = [];
    }
  }

  //Add, and Remove Favorite

  toggleFavorite(movieId: string): void {
    if (isPlatformBrowser(this.platformId) && this.currentUser) {
      const observer: Observer<any> = {
        next: () => {
          const action = this.favoriteMovies.includes(movieId)
            ? 'removed from'
            : 'added to';
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
        complete: () => {},
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
  showGenre(movie: Movie): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: `Genre: ${movie.Genre.Name}`,
        content: movie.Genre.Description,
      },
      width: '400px',
    });
  }

  showDirector(movie: Movie): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: `Director: ${movie.Director.Name}`,
        content: movie.Director.Bio,
      },
      width: '400px',
    });
  }

  showDetail(movie: Movie): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: `Title: ${movie.Title}`,
        content: movie.Description,
      },
      width: '400px',
    });
  }
}
