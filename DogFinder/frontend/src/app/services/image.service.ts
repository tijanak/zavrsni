import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@dog-finder/environment';
import { IImage } from '@dog-finder/models';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private httpClient: HttpClient) {}
  postImagesForPost(files: FileList, postId: number) {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('images', file));
    return this.httpClient.post<IImage[]>(
      `${environment.API_URL}images/${postId}`,
      formData,
      {}
    );
  }
  getImagesForPost(postId: number) {
    return this.httpClient.get<IImage[]>(
      `${environment.API_URL}images/post/${postId}`
    );
  }
  deleteImage(id: number) {
    return this.httpClient.delete<void>(`${environment.API_URL}images/${id}`);
  }
}
