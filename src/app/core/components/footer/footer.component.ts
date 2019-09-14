import { BroadcasterService } from 'ng-broadcaster';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit , Inject, PLATFORM_ID} from '@angular/core';
import { SharedStorage } from '../../shared/storageShared';
import { ProductsService } from '../../shared/services/products.service';

import { SnotifyService } from 'ng-snotify';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  categories = [] as any;
  CurrentUserData = SharedStorage.current_user_data;
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any,
  private proudctControlelr : ProductsService ,
    private broadCaster : BroadcasterService ,
    private snotify : SnotifyService , @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    this.broadCaster.on('UserSign').subscribe(data => {
      this.CurrentUserData = SharedStorage.current_user_data;
    });
    this.getAllCategoreyWithsubcategory();
  }
  getAllCategoreyWithsubcategory() {
    if (SharedStorage.product_categories && SharedStorage.product_categories.length){
      this.categories = SharedStorage.product_categories;
    }
    this.proudctControlelr.getAllproductCategory(false, true, true, false , '').subscribe(data => {
      if (data['status'] === 'success') {
        // console.log(data);
        SharedStorage.product_categories = data['data'];
        this.categories = data['data']['rows'];
      }
    }, err => {

    });
  }
  onLogOutClicked() {
    this.snotify.confirm('هل تريد الخروج من الموقع ؟', {
      timeout: 5000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      buttons: [
        {text: 'نعم', action: () => {
          this.localStorage.clear();
          location.reload();
        }, bold: false},
        {text: 'لا', action: () => {

        }, bold: false},
      ]
    });
  }

}
