import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api}/files`;

  uploadImageFile() {

  }
}
