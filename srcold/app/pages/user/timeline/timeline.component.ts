import { Title } from '@angular/platform-browser';
import { sharedClass } from './../../../core/shared/sharedattrubite';
import { AuthenticationService } from './../../../core/shared/services/authentication.service';
import { BroadcasterService } from 'ng-broadcaster';
import { ProductsService } from './../../../core/shared/services/products.service';
import { MarketsService } from './../../../core/shared/services/markets.service';
import { SharedStorage } from './../../../core/shared/storageShared';
import { SeoService } from './../../../core/shared/services/seo.service';
import { BsModalService } from 'ngx-bootstrap/modal';
// import { SelectPtoductOptionsComponent } from './../../../core/components/modales/select-ptoduct-options/select-ptoduct-options.component';
import { Component, OnInit } from '@angular/core';

import { SnotifyService } from 'ng-snotify';

import swal from 'sweetalert2';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  ImageBase = sharedClass.IMAGE_BASE_URL;
  CurrentPageType = 'home';
  CurrentUserData = SharedStorage.current_user_data;
  MarketsFavorites = [] as any;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  IsLoading = false;
  Productsoffers = [] as any;
  Rates = [] as any;
  Offset = { home: 0, notification: 0, rates: 0, offers: 0 }
  OffersType = {
    '1': 'أحدث الموديلات',
    // '2': 'عرض القطعه الزياده',
    // '3': 'عرض شراء قطعه واضافه قطعتين زياده',
    '4': 'المنتجات المفضلة للزائرين',
    '5': 'ألاأونا بتختارلك'
  };
  math = Math;
  Notifications = [] as any;
  subscrib;
  constructor(private marketsController: MarketsService,
    private snotify: SnotifyService,
    public productsController: ProductsService,
    private brodcaster: BroadcasterService,
    private Authentication: AuthenticationService,
    private modelRef: BsModalService, private seoService: SeoService , private title : Title) {
      this.title.setTitle('الاأونا - متاجرك')
    this.seoService.createLinkForCanonicalURL();
  }
  ngOnInit() {
    this.getAllUserFavorites();
  }
  getAllUserFavorites() {
    this.IsLoading = true;
    this.marketsController.getAllUserFavorite(this.CurrentUserData.id, this.Offset.home).subscribe(data => {
      this.IsLoading = false;
      // console.log(data);
      if (data['status'] == 'success') {
        if (this.Offset.home == 0) {
          this.MarketsFavorites = data['data']['rows'];
        } else {
          this.MarketsFavorites = this.MarketsFavorites.concat(data['data']['rows']);
        }
      } else {
        this.snotify.error('حدثت مشكله عند احضار البيانات برجاء اعاده المحاوله مره اخري');
      }
    }, err => {
      // console.log(err);
      this.snotify.error('حدثت مشكله عند احضار البيانات برجاء اعاده المحاوله مره اخري');
    })
  }
  loadAllUserNotification() {
    this.Authentication.GetUseNotifications(this.CurrentUserData.id, this.Offset.notification).subscribe(data => {
      if (data['status'] == 'success') {
        if (this.Offset.notification == 0) {
          this.Notifications = data['data'];
        } else {
          this.Notifications = this.Notifications.concat(data['data']);
        }
      } else {
        this.snotify.warning('حدثت مشكله عند احضار البيانات برجاء اعاده المحاوله مره اخري');
      }
    }, err => {
      this.snotify.error('حدثت مشكله عند احضار البيانات برجاء اعاده المحاوله مره اخري');
    })
  }
  getAllUserRates() {
    this.IsLoading = true;
    this.productsController.getallRates(false, this.CurrentUserData.id, false, this.Offset.rates).subscribe(data => {
      this.IsLoading = false;
      if (data['status'] == 'success') {
        if (this.Offset.rates == 0) {
          this.Rates = data['data']['rows']
        } else {
          this.Rates = this.Rates.concat(data['data']['rows']);
        }
      } else {
        this.snotify.warning('حدثت مشكله عند احضار البيانات برجاء اعاداه المحاوله مره اخري')
      }
    }, err => {
      this.snotify.error('حدثت مشكله عند احضار البيانات برجاء اعاداه المحاوله مره اخري')
    })
  }
  getAllOffers() {
    this.productsController.getAllOffersReleatedToUser(this.CurrentUserData.id, this.Offset.offers).subscribe(data => {
      // console.log(data);
      if (data['status'] == 'success') {
        if (this.Offset.offers == 0) {
          this.Productsoffers = data['data']['rows'];
        } else {
          this.Productsoffers = this.Productsoffers.concat(data['data']['rows']);
        }
      } else {
        this.snotify.warning('حدذت مشكله عند احضار البيانات برجاء اعادره المحاوله مره اخري');
      }
    }, err => {
      this.snotify.error('حدذت مشكله عند احضار البيانات برجاء اعادره المحاوله مره اخري');
    })
  }
  onPageChange(pageType) {
    this.CurrentPageType = pageType;
    if (pageType == 'home') {
      this.getAllUserFavorites();
    } else if (pageType == 'notification') {
      this.loadAllUserNotification();
    } else if (pageType == 'rates') {
      this.getAllUserRates();
    } else if (pageType == 'offers') {
      this.getAllOffers();
    }
  }
  onScroll() {
    if (!this.IsLoading) {
      if (this.CurrentPageType == 'home') {
        this.Offset.home++;
        this.getAllUserFavorites();
      } else if (this.CurrentPageType == 'rates') {
        this.Offset.rates++;
        this.getAllUserRates();
      } else if (this.CurrentPageType == 'offers') {
        this.Offset.offers++;
        this.getAllOffers();
      } else if (this.CurrentPageType == 'notification') {
        this.Offset.notification++;
        this.loadAllUserNotification();
      }
    }
  }
  onRateEditClicked(rate) {
    this.productsController.editRate(rate).subscribe(data => {
      if (data['status'] == 'success') {
        this.snotify.success('تم تعديل التقيم بنجاح');
        this.Rates = [];
        this.Offset.rates = 0;
        this.getAllUserRates();
      } else {
        this.snotify.warning('حدثت مشكله عند احضار البيانات برجاء اعاداه المحاوله مره اخري')
      }
    }, err => {
      this.snotify.error('حدثت مشكله عند احضار البيانات برجاء اعاداه المحاوله مره اخري')
    })
  }
  onRateDeleteClicked(rate) {
    this.productsController.removeRate(rate.id).subscribe(data => {
      if (data['status'] == 'success') {
        this.snotify.success('تم مسح التقيم بنجاح');
        this.Rates = [];
        this.Offset.rates = 0;
        this.getAllUserRates();
      } else {
        this.snotify.warning('حدثت مشكله عند احضار البيانات برجاء اعاداه المحاوله مره اخري')
      }
    }, err => {
      this.snotify.error('حدثت مشكله عند احضار البيانات برجاء اعاداه المحاوله مره اخري')
    })
  }
  DeleteNotifiction(id) {
    this.Authentication.deleteUserNotification(id).subscribe(data => {
      if (data['status'] == 'success') {
        this.snotify.success('تم مسح العنصر بنجاح');
        this.Offset.notification = 0;
        this.loadAllUserNotification();
      } else {
        this.snotify.warning('حدذت مشكله عند احضار البيانات برجاء اعادره المحاوله مره اخري');
      }
    }, err => {
      this.snotify.error('حدذت مشكله عند احضار البيانات برجاء اعادره المحاوله مره اخري');
    })
  }
  onAddToFavoritePressed(ProductData) {
    if (!SharedStorage.current_user_data || !SharedStorage.current_user_data['id']) {
      swal('خطأ', 'يجب ان تكون مسجل حتي تسطتيع اضافه هذا المنتج الي المفضله', 'warning');
      return;
    }
    this.productsController.addProductToFavorite(SharedStorage.current_user_data.id, ProductData.id).subscribe(data => {
      if (data['status'] == 'success') {
        SharedStorage.current_user_data['favorites'].push({ id: data['data']['id'], product_id: ProductData['id'] });
        this.snotify.success('تم اضافه المنتج بنجاح الي المفضله');
      } else {
        if (data['error']['action'] == 'exists-before') {
          this.snotify.warning('هذا المنتج موجود بالفعل في المفضله');
        }
      }
    }, err => {
      this.snotify.warning('حدثت مشكله عند اضافه المنتج الي المفضله برجاء التحقق من الاتصال بالانترنت واعاده المحاوله');
    })
  }

}
