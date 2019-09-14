import { Component, OnInit } from '@angular/core';
import { PriceOfferService } from '../../../core/shared/services/price-offer.service';
import { SnotifyService } from 'ng-snotify';
import { ActivatedRoute, Router } from '@angular/router';
import { sharedClass } from '../../../core/shared/sharedattrubite';
import { SharedStorage } from '../../../core/shared/storageShared';

@Component({
  selector: 'app-show-replays',
  templateUrl: './show-replays.component.html',
  styleUrls: ['./show-replays.component.css']
})
export class ShowReplaysComponent implements OnInit {

  repleyes = [];
  filterData = {offset : '' ,offer_price_id : '' , market_id : '' };
  ImageBase = sharedClass.IMAGE_BASE_URL;
  UserData = SharedStorage.current_user_data;
  constructor(private priceOffer : PriceOfferService ,private snotify: SnotifyService,private route : ActivatedRoute,private router : Router ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(data => {
      if (data['offer_price_id']){
        this.filterData['offer_price_id'] = data['offer_price_id'];
        this.loadAllReplyes();
      } else {
        this.router.navigate(['/']);
      }
    })
  }
  loadAllReplyes(){

    this.priceOffer.replayesIndex(this.filterData.offset , this.filterData.offer_price_id , this.filterData.market_id).subscribe(data => {
      if (data['status'] == 'success'){
        this.repleyes = data['data']['rows'];
        console.log(data);
      } else {
        this.snotify.error('هناك مشكله برجاء التأكد من الاتصال بالانترنت واعاده المحاوله');
      }
    }, err => {
      this.snotify.error('هناك مشكله برجاء التأكد من الاتصال بالانترنت واعاده المحاوله');
    })
  }

}
