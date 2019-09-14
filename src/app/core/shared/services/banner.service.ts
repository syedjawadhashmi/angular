import { sharedClass } from './../sharedattrubite';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private http: TransferHttpService) { }

  getAllBanners(For, subFor) {
    let URL = `${sharedClass.BASE_URL}/banner?for_value=${For}&subfor_value=${subFor}`;
    return this.http.get(URL);
  }
}
