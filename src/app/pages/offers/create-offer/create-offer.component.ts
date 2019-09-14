import { Title } from '@angular/platform-browser';
// import { MarketProductComponent } from '../../../core/components/modales/market-product/market-product.component';
import { ProductsService } from './../../../core/shared/services/products.service';
import { BroadcasterService } from 'ng-broadcaster';
import { SharedStorage } from './../../../core/shared/storageShared';
import { SeoService } from './../../../core/shared/services/seo.service';
import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.css']
})
export class CreateOfferComponent implements OnInit {


  OfferDataType1 = { offer_type: 1 } as any;
  OfferDataType23 = {} as any;
  OfferDataType4 = { offer_type: 4 } as any;
  OfferDataType5 = { offer_type: 5 } as any;

  CurrentMarketData = SharedStorage.current_user_data['markets'][0];
  constructor(private modelService: BsModalService,
    private broadCaster: BroadcasterService,
    private productsService: ProductsService,
    private snotify: SnotifyService,
    private router: Router, private seoService: SeoService, private title : Title) {
      this.title.setTitle('الاأونا - اضافه عرض جديد')
    this.seoService.createLinkForCanonicalURL();
    this.broadCaster.broadcast('selected_p');
  }

  ngOnInit() {
    this.OfferDataType4['value'] = 20;
    if (SharedStorage.current_user_data['category'] === 'seller' && SharedStorage.current_user_data['Seller']['NumberOfMarkets'] == 0) {
      this.snotify.warning('يجب عليك اضافه المتجر الخاص بك');
      this.router.navigate(['/auth/seller-singup']);
      return;
    } else {

    }
  }
  onAddClicked(offerType) {
    const SelectedProducts = SharedStorage.SelectedProducts;
    if (!SelectedProducts || SelectedProducts.length === 0) {
      this.snotify.warning('برجاء قم باضافه بعض المنتجات التي تريد اضافتها لهذا العرض');
      return;
    }
    if (!offerType.offer_type) {
      this.snotify.warning('برجاء قم بأختيار نوع العرض');
      return;
    }
    if (!offerType['from'] || !offerType['to']) {
      this.snotify.error('برجاء قم بأختيار مده اعلان العرض');
      return;
    }
    offerType['products'] = SelectedProducts;
    offerType['market_id'] = this.CurrentMarketData['id'];
    this.productsService.createOfferWithproducts(offerType).subscribe(data => {
      if (data['status'] === 'success') {
        this.snotify.success('تم اضافه العرض الي المنتجات بنجاح سوف يتم مراجعه العرض والموافقه عليه في اقرب وقت');
        this.router.navigate(['/home']);
      } else {
        this.snotify.error('برجاء كتابه كل البيانات لكي تتم عمليه الاضافه');
      }
    }, err => {
      this.snotify.error('حدثت مشكله برجاء اعاده المحاوله بعد التحقق من الاتصال بالانترنت');
    });
  }
  getOfferDuraction(offerData) {
    if (offerData.from && offerData.to) {
      const duration = moment(offerData.to).diff(moment(offerData.from), 'days');
      if (duration <= 0) {
        offerData.from = '';
        offerData.to = '';
        offerData.duration = '';
        this.snotify.warning('لا يمكن ان يكون تاريخ البدايه اكبر من تاريخ النهايه');
        return;
      }
      offerData.duration = duration;
    }
  }
  onAddProductsPressed(offerData) {
    // const bsModel = this.modelService.show(MarketProductComponent, { class: ' ProductModel ' });
  }


}
