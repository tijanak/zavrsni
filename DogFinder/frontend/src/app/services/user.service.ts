import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@dog-finder/environment';
import { IUser, UpdateUserDto } from '@dog-finder/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}
  updateProfile(updateDto: UpdateUserDto) {
    return this.httpClient.patch<IUser>(
      `${environment.API_URL}user`,
      updateDto
    );
  }
}
