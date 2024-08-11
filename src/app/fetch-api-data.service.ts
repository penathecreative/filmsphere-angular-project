import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://filmsphere-5e594b2ffc50.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  private getToken(): string {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).token : '';
  }

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

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Making the api call for the user login endpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log('Attempting login with:', userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      tap((response: any) => console.log('Login response:', response)),
      catchError((error: any) => {
        console.error('Login error:', error);
        return throwError(
          () => new Error(error.error.message || 'Login failed')
        );
      })
    );
  }

  //Api Call to Get all movies
  public getAllMovies(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(
        () => new Error('No token found. Please log in again.')
      );
    }
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Api Call to Get a single movie
  public getOneMovie(title: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(
        () => new Error('No token found. Please log in again.')
      );
    }
    return this.http
      .get(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Api Call to Get a Director
  public getDirector(directorName: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(
        () => new Error('No token found. Please log in again.')
      );
    }
    return this.http
      .get(apiUrl + 'movies/directors/' + directorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  //Api Call to Get a User
  public getUser(username: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(
        () => new Error('No token found. Please log in again.')
      );
    }
    return this.http
      .get(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Api Call to Get FavoriteMovies
  public getFavoriteMovies(username: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(
        () => new Error('No token found. Please log in again.')
      );
    }
    return this.http
      .get(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map((data) => this.extractResponseData(data).FavoriteMovies),
        catchError(this.handleError)
      );
  }

  //Api Call to Add a Movie to Favorite Movies endpoint
  public addFavoriteMovies(username: string, movieID: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(
        () => new Error('No token found. Please log in again.')
      );
    }
    return this.http
      .post(
        apiUrl + 'users/' + username + '/movies/' + movieID,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Api Call to Edit User
  public editUser(username: string, userDetails: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(
        () => new Error('No token found. Please log in again.')
      );
    }
    return this.http
      .put(apiUrl + 'users/' + username, userDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Api Call to Delete User
  public deleteUser(username: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(
        () => new Error('No token found. Please log in again.')
      );
    }
    return this.http
      .delete(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Api Call to Delete a Movie to Favorite Movies endpoint
  public deleteFavoriteMovies(
    username: string,
    movieID: string
  ): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(
        () => new Error('No token found. Please log in again.')
      );
    }
    return this.http
      .delete(apiUrl + 'users/' + username + '/movies/' + movieID, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Non-typed response extraction
  private extractResponseData(res: object): any {
    const body = res;
    return body || {};
  }
}
