import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@dog-finder/environment';
import { Observable } from 'rxjs';
import { CreatePostDto, IPost } from '@dog-finder/models';
import { UpdatePostDto } from '@dog-finder/models';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly baseUrl = environment.API_URL + 'posts';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<IPost[]>(this.baseUrl);
  }

  findOne(id: number) {
    return this.http.get<IPost>(`${this.baseUrl}/${id}`);
  }

  create(createPostDto: CreatePostDto) {
    return this.http.post<IPost>(this.baseUrl, createPostDto);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.http.patch(`${this.baseUrl}/${id}`, updatePostDto);
  }

  remove(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
