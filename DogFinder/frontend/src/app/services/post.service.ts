import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@dog-finder/environment';
import { Observable } from 'rxjs';
import { CreatePostDto } from '@dog-finder/models';
import { UpdatePostDto } from '@dog-finder/models';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly baseUrl = environment.API_URL + 'posts';

  constructor(private http: HttpClient) {}

  findAll(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  findOne(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  create(createPostDto: CreatePostDto): Observable<any> {
    return this.http.post(this.baseUrl, createPostDto);
  }

  update(id: number, updatePostDto: UpdatePostDto): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, updatePostDto);
  }

  remove(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
