import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@dog-finder/environment';
import { IPost } from '@dog-finder/models';

@Injectable({
  providedIn: 'root',
})
export class DognnService {
  constructor(private http: HttpClient) {}

  getMatchingPosts(id: number) {
    return this.http.get<IPost[]>(`${environment.API_URL}nn/matches/${id}`);
  }
}
