import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  constructor(private http: HttpClient) { }
  public getJSON(): Observable<any> {
    return this.http.get('./assets/folder.json');
  }
}
