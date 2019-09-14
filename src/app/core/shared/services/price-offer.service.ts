import { Injectable } from '@angular/core';
import { sharedClass } from '../sharedattrubite';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PriceOfferService {

  constructor(private http: HttpClient) { }
  index(offset, user_id, market_id, country_id, category_id) {
    let URL = `${sharedClass.BASE_URL}/offer/price`;
    return this.http.get(URL, { params: { offset, user_id, market_id, country_id, category_id } });
  }
  create(PriceOfferData) {
    let URL = `${sharedClass.BASE_URL}/offer/price/create`;
    return this.http.post(URL, PriceOfferData);
  }


  replayesIndex(offset, offer_price_id, market_id) {
    let URL = `${sharedClass.BASE_URL}/offer/price/replay`;
    return this.http.get(URL, { params: { offset, offer_price_id, market_id } });
  }
  replayCreate(ReplayData) {
    let URL = `${sharedClass.BASE_URL}/offer/price/replay/create`;
    return this.http.post(URL, ReplayData);
  }

}
