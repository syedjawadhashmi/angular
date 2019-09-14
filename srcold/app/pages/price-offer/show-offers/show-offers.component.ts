import { Component, OnInit } from '@angular/core';
import { sharedClass } from '../../../core/shared/sharedattrubite';
import { PriceOfferService } from '../../../core/shared/services/price-offer.service';
import { SnotifyService } from 'ng-snotify';
import { ActivatedRoute } from '@angular/router';
import { SharedStorage } from '../../../core/shared/storageShared';

@Component({
  selector: 'app-show-offers',
  templateUrl: './show-offers.component.html',
  styleUrls: ['./show-offers.component.css']
})
export class ShowOffersComponent implements OnInit {

  fitlerData = {offset : 0  , country_id : '' , category_id : '' ,user_id : '' , market_id : ''};
  priceOffers = [];
  ImageBase = sharedClass.IMAGE_BASE_URL;
  userData ={} as any;
  constructor(private priceOffer : PriceOfferService ,     private snotify: SnotifyService,private route : ActivatedRoute) { }

  ngOnInit() {
    // this.route.queryParams.subscribe(qParams => {
    //   if (this.)
    // })
    this.userData = SharedStorage.current_user_data;
    if (this.userData.category == 'seller'){
      this.fitlerData['market_id'] = this.userData['markets'][0].id;
    } else {
      this.fitlerData['user_id'] = this.userData.id;
    }
    this.getallPriceOffer();
  }
  getallPriceOffer(){
    console.log(this.fitlerData);
    this.priceOffer.index(this.fitlerData.offset, this.fitlerData.user_id , this.fitlerData.market_id , this.fitlerData.country_id,this.fitlerData.category_id).subscribe(data => {
      if (data['status'] == 'success'){
        this.priceOffers = data['data']['rows'];
      } else {
        this.snotify.error('هناك مشكله برجاء التأكد من الاتصال بالانترنت واعاده المحاوله');
      }
    }, err => {
      this.snotify.error('هناك مشكله برجاء التأكد من الاتصال بالانترنت واعاده المحاوله');
    })
  }

}
