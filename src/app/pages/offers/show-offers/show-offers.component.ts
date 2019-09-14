import { Title } from '@angular/platform-browser';
import { SharedStorage } from './../../../core/shared/storageShared';
import { sharedClass } from './../../../core/shared/sharedattrubite';
import { BroadcasterService } from 'ng-broadcaster';
import { ProductsService } from './../../../core/shared/services/products.service';
import { SeoService } from './../../../core/shared/services/seo.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import swal from 'sweetalert2';
import { HelperToolsService } from './../../../core/shared/services/helper-tools.service';
import { MetaService } from '@ngx-meta/core';

@Component({
  selector: 'app-show-offers',
  templateUrl: './show-offers.component.html',
  styleUrls: ['./show-offers.component.css']
})
export class ShowOffersComponent implements OnInit {
  offers = [] as any;
  offset = 0;
  currentOfferType = false;
  ImageBase = sharedClass.IMAGE_BASE_URL;
  math = Math;
  date = Date();
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  IsLoading = false;
  subscrib;
  ShowMore = true;
  OffersType = {
    '1': 'أحدث الموديلات',
    // '2': 'عرض القطعه الزياده',
    // '3': 'عرض شراء قطعه واضافه قطعتين زياده',
    '4': 'المنتجات المفضلة للزائرين',
    '5': 'ألاأونا بتختارلك'
  };
  settingData;
  constructor(public productController: ProductsService,
    private router: Router,
    private activateRouter: ActivatedRoute,
    private snotify: SnotifyService,
    private brodcaster: BroadcasterService,
    private modelRef: BsModalService,
    private seoService: SeoService, private title: Title, 
    private helperTools: HelperToolsService, 
    private meta: MetaService) {
    this.title.setTitle('الاأونا - عرض العروض');
    this.seoService.createLinkForCanonicalURL();

  }
  async  ngOnInit() {

    this.settingData = await this.helperTools.getSetting();

    this.meta.setTag('description', this.settingData.offers_meta_description);
    this.meta.setTag('og:description', this.settingData.offers_meta_description);
    this.meta.setTag('keywords', this.settingData.offers_meta_keyword);

    this.activateRouter.queryParams.subscribe(params => {
      const offer_type = params['offer_type'];
      if (offer_type) {
        this.currentOfferType = offer_type;
        this.getAllOffers();
      } else {
        this.getAllOffers();
      }

    }, err => {

    });
  }
  getAllOffers() {
    this.IsLoading = true;
    this.productController.getAllProductOffersUnGrouped(this.offset, Date(), this.currentOfferType).subscribe(data => {
      // console.log(data);
      this.IsLoading = false;
      if (data['status'] === 'success') {

        if (this.offset === 0) {
          this.offers = data['data']['rows'];
        } else {
          this.offers = this.offers.concat(data['data']['rows']);
          if (data['data']['rows'].length == 0) {
            this.ShowMore = false;
          }
        }
      } else {

      }
    }, err => {

    });
  }
  onMarketDetailsClicked(market) {
    SharedStorage.current_makret_data = market;
    this.router.navigate(['/markets/details/' + market.id + '_' + market.name]);
  }
  onProductDetailsClciked(product) {
    // SharedStorage.current_product_data = offer.product;
    // SharedStorage.currentOfferData = offer;
    this.router.navigate(['/products/details/' + product.category.name + '/' + product.subCategory.name + '/' + product.id + '_' + product.name]);
  }
  onScroll() {
    if (!this.IsLoading) {
      this.offset++;
      this.getAllOffers();
    }
  }
}
