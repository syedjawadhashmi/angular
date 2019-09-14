import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sharedClass } from '../sharedattrubite';

@Injectable({
  providedIn: 'root'
})
export class HelperToolsService {

  settingData;
  constructor(private http: HttpClient  ) { }
  getSetting() {
    return new Promise((resolve, reject) => {
      if (this.settingData) {
        resolve(this.settingData);
      }
      this.http.get(`${sharedClass.BASE_URL}/setting`).subscribe(data => {
        if (data['status'] == 'success') {
          this.settingData = data['data'];
          resolve(this.settingData);
        } else {
          reject(data);
        }
      }, err => {
        reject(err);
      })
    })
  }
}
