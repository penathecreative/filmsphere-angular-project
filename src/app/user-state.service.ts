import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface User {
  _id: string;
  username: string;
  email: string;
  birthday: string;
  favoriteMovies: string[];
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: User | null) {
    this.userSubject.next(user);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }
}
