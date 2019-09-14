import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sharedClass } from '../sharedattrubite';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable({
  providedIn: 'root'
})
export class MarketsService {

  constructor(private http: TransferHttpService) { }
  getAllmarkets(offset, attr , category_id , country_id , city_id , status) {
    let URL = `${sharedClass.BASE_URL}/market?offset=${offset}&attr=${attr}&category_id=${category_id}&country_id=${country_id}&city_id=${city_id}&status=${status}`;
    return this.http.get(URL);
  }
  getMarketById(market_id){
    let URL = `${sharedClass.BASE_URL}/market/${market_id}`;
    return this.http.get(URL);
  }
  addnewMarket(marketData) {
    let URL = `${sharedClass.BASE_URL}/market/create`;
    return this.http.post(URL, marketData);
  }
  getlocationFitler (lat , lng , range){
    let Body = {
      lat , lng , range
    };
    let URL = `${sharedClass.BASE_URL}/market/filter/geolocation`;
    return this.http.post(URL , Body);
  }
  getAllUsers(offset, category, attr, status) {
    let body = {
      offset: offset,
      category: category,
      attr: attr,
      status: status
    };
    let URL = `${sharedClass.BASE_URL}/auth/user`;
    return this.http.post(URL, body);
  }
  editMarket(marketData) {
    let URL = `${sharedClass.BASE_URL}/market/edit`;
    return this.http.post(URL, marketData);
  }
  removeMarket(market_id) {
    let URL = `${sharedClass.BASE_URL}/market/remove`;
    return this.http.post(URL, { id: market_id });
  }
  changeMarketStatus(market_id, status) {
    let URL = `${sharedClass.BASE_URL}/market/status`;
    return this.http.post(URL, { market_id: market_id, status: status });
  }
  getMarketCategory(offset) {
    let URL = `${sharedClass.BASE_URL}/market/category`;
    if (offset != false || offset == 0) {
      URL += `?offset=${offset}`;
    }
    return this.http.get(URL);
  }
  uploadMarketsAsExcel(formData) {
    let headers = new HttpHeaders();
    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    let URL = `${sharedClass.BASE_URL}/market/excel`;
    return this.http.post(URL, formData, { headers: headers });
  }
  loadAllMarketsBanners(market_id,status ,offset) {
    let URL = `${sharedClass.BASE_URL}/market/banner`;
    return this.http.get(URL, {params : {market_id , status , offset}});
  }
  addNewMarketBanner(BannerData) {
    let URL = `${sharedClass.BASE_URL}/market/banner/create`;
    return this.http.post(URL, BannerData);
  }
  editMarketBanner(BannerData) {
    let URL = `${sharedClass.BASE_URL}/market/banner/edit`;
    return this.http.post(URL, BannerData);
  }
  deleteMarketBanner(banner_id) {
    let URL = `${sharedClass.BASE_URL}/marekt/banner/remove`;
    return this.http.post(URL, { id: banner_id });
  }

  // market Favorite
  addMarketToFavorite(market_id , user_id){
    let URL = `${sharedClass.BASE_URL}/favorite/create`;
    return this.http.post(URL , {market_id : market_id , user_id : user_id});
  }
  deleteFavorite(favorite_id){
    let URL = `${sharedClass.BASE_URL}/favorite/remove`;
    return this.http.post(URL , {id : favorite_id});
  }
  getAllUserFavorite(user_id , offset){
    let URL = `${sharedClass.BASE_URL}/favorite?user_id=${user_id}&offset=${offset}`;
    return this.http.get(URL);
  }
}
