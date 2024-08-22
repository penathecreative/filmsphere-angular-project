import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Movie } from '../models'; // Import the Movie interface

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: Movie[] = []; // Use the Movie interface
  favoriteMovies: string[] = []; // Array of favorite movie IDs

  constructor(
    private fetchApiData: FetchApiDataService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (res: Movie[]) => {
        this.movies = res;
        this.setFavoriteFlags();
      },
      (err) => {
        console.error('Error fetching movies:', err);
      }
    );
  }

  setFavoriteFlags(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.favoriteMovies = user.favoriteMovies || [];
  }

  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  toggleFavorite(movieId: string): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (this.isFavorite(movieId)) {
      this.fetchApiData.deleteFavouriteMovie(user.Username, movieId).subscribe(
        (res) => {
          this.favoriteMovies = res.favoriteMovies;
          localStorage.setItem('user', JSON.stringify(user));
          this.snackBar.open('Removed from favorites', 'OK', {
            duration: 2000,
          });
        },
        (err) => {
          console.error('Error removing favorite movie:', err);
        }
      );
    } else {
      this.fetchApiData.addFavouriteMovie(user.Username, movieId).subscribe(
        (res) => {
          this.favoriteMovies = res.favoriteMovies;
          localStorage.setItem('user', JSON.stringify(user));
          this.snackBar.open('Added to favorites', 'OK', { duration: 2000 });
        },
        (err) => {
          console.error('Error adding favorite movie:', err);
        }
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
        title: movie.Title,
        content: movie.Description,
      },
      width: '400px',
    });
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.removeItem('user');
  }

  redirectProfile(): void {
    this.router.navigate(['profile']);
  }
}
