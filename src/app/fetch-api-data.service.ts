import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Declaring the API URL that will provide data for the client app
const apiUrl = 'https://filmsphere-5e594b2ffc50.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  // Handle errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  // Extract response data
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  // Helper method to get token from localStorage
  private getToken(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token || '';
  }

  // Register a user
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Login a user
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Get all movies
  public getAllMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getToken(),
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get a single movie by name
  public getOneMovie(movieName: string): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/' + movieName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getToken(),
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get director details
  public getDirector(directorName: string): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/director/' + directorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getToken(),
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get genre details
  public getGenre(genreName: string): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/genre/' + genreName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getToken(),
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get user details
  public getUser(username: string): Observable<any> {
    return this.http
      .get(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getToken(),
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get favorite movies of a user
  public getFavouriteMovies(username: string): Observable<any> {
    return this.http
      .get(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getToken(),
        }),
      })
      .pipe(
        map(this.extractResponseData),
        map((data) => data.favoriteMovies),
        catchError(this.handleError)
      );
  }

  // Add a movie to favorite movies
  public addFavouriteMovie(username: string, movieID: string): Observable<any> {
    return this.http
      .post(
        apiUrl + 'users/' + username + '/movies/' + movieID,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + this.getToken(),
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Edit user details
  public editUser(username: string, userDetails: object): Observable<any> {
    return this.http
      .put(apiUrl + 'users/' + username, userDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getToken(),
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Delete a user
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getToken(),
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Delete a movie from favorite movies
  public deleteFavouriteMovie(
    username: string,
    movieID: string
  ): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + username + '/movies/' + movieID, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.getToken(),
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
}
