// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDialogModule, MatIconModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(public fetchApiData: FetchApiDataService) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (res) => {
        this.movies = res;

        let user = JSON.parse(localStorage.getItem('user') || '');
        this.movies.forEach((movie: any) => {
          movie.isFavorite = user.favoriteMovies.includes(movie._id);
        });
        return this.movies;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
