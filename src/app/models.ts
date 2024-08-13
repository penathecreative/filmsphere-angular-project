// src/app/models/models.ts

// Define the Genre interface
export interface Genre {
  Name: string;
  Description: string;
}

// Define the Director interface
export interface Director {
  Name: string;
  Bio: string;
  Birth: string;
  ImagePath: string;
}

// Define the Movie interface
export interface Movie {
  _id: string;
  Title: string;
  Description: string;
  Genre: Genre;
  Director: Director;
  Featured: boolean;
}

// Define the User interface if needed (example)
export interface User {
  username: string;
  // add other user properties if needed
}
