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
    this.getFavoriteMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (res: Movie[]) => {
        this.movies = res;
      },
      (err) => {
        console.error('Error fetching movies:', err);
      }
    );
  }

  getFavoriteMovies(): void {
    this.fetchApiData
      .getFavouriteMovies(localStorage.getItem('user') || '')
      .subscribe((resp: any) => {
        this.favoriteMovies = resp;
        return this.favoriteMovies;
      });
  }
  toggleFavorite(id: string): void {
    if (this.favoriteMovies.includes(id)) {
      // Remove from favorites
      this.fetchApiData
        .deleteFavouriteMovie(localStorage.getItem('user') || '', id)
        .subscribe((resp: any) => {
          this.snackBar.open(
            'Successfully removed movie from favorites',
            'OK',
            {
              duration: 4000,
            }
          );
          this.getFavoriteMovies();
        });
    } else {
      // Add to favorites
      this.fetchApiData
        .addFavouriteMovie(localStorage.getItem('user') || '', id)
        .subscribe((resp: any) => {
          this.snackBar.open('Successfully added movie to favorites', 'OK', {
            duration: 4000,
          });
          this.getFavoriteMovies();
        });
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
