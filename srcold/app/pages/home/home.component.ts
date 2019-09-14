import { Title } from '@angular/platform-browser';
import { MetaService } from '@ngx-meta/core';
import { SharedStorage } from './../../core/shared/storageShared';
import { BannerService } from './../../core/shared/services/banner.service';
import { BroadcasterService } from './../../core/shared/services/broadcaster.service';
import { ProductsService } from './../../core/shared/services/products.service';
import { sharedClass } from './../../core/shared/sharedattrubite';
import { WINDOW } from '@ng-toolkit/universal';
import { SeoService } from './../../core/shared/services/seo.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { SwiperConfigInterface, SwiperConfig, SwiperComponent } from 'ngx-swiper-wrapper';

import { Router } from '@angular/router';

import { SnotifyService } from 'ng-snotify';
import swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  SliderAds = [] as any;
  OtherAds = [] as any;

  ImageBase = sharedClass.IMAGE_BASE_URL;
  math = Math;
  CategoriesProduct;
  Swiperindex = 0;
  VerticalSwiperindex = 0;
  sliderIndex = {} as any;
  Offers = [] as any;
  ProductInFavList = false;
  // @ViewChild('MainAds') swiper;
  // @ViewChild('MainAds') set swiper(swiperComp: SwiperComponent) {
  //   this.Swiperconfig.loop = true;
  //   swiperComp.directiveRef!!.update();
  // }
  Swiperconfig: SwiperConfigInterface = {
    direction: 'horizontal',
    allowSlideNext: true,
    allowSlidePrev: true,
    spaceBetween: 30,
    // loop: true,
    navigation: true,
    pagination: true,
    autoplay: true,
    // autoHeight: true,
    height: 200,
    observer: true,
    breakpoints: {
      767: {
        height: 200
      }
    }
  };
  VerticalSliderConfig: SwiperConfigInterface = {
    direction: 'vertical',
    allowSlideNext: true,
    allowSlidePrev: true,
    spaceBetween: 30,
    navigation: true,
    allowTouchMove: false,
    autoplay: true,
    autoHeight: true,
    height: 700,
    noSwiping: true,
    breakpoints: {
      988: {
        height: 750
      },
      767: {
        height: 390
      },
      558: {
        height: 410
      }
    }
  };
  VerticalSliderConfigProduct: SwiperConfigInterface = {
    direction: 'vertical',
    allowSlideNext: true,
    allowSlidePrev: true,
    spaceBetween: 30,
    navigation: true,
    allowTouchMove: false,
    autoplay: false,
    autoHeight: true,
    height: 700,
    noSwiping: true,
    breakpoints: {
      988: {
        height: 750
      },
      767: {
        height: 600
      },
      570 : {
        height : 700
      },
      546:{
        height: 650
      },
      480:{
        height: 500
      },
      360: {
        height: 500
      }
    }
  };
  subscrib = undefined;
  offersType = {
    type1: 'أحدث الموديلات',
    // type2: 'عروض قطعه وقطعه',
    // type3: 'عروض قطعه وقطعتين',
    type4: 'المنتجات المفضلة للزائرين',
    type5: 'ألاأونا بتختارلك'
  };
  offersTypeNumbers = { type1: '1', type2: '2', type3: '3', type4: '4', type5: '5' };

  constructor(@Inject(WINDOW) private window: Window, private bannerService: BannerService,
    public productController: ProductsService,
    private router: Router,
    private snotify: SnotifyService,
    private brodcaster: BroadcasterService,
    private modelRef: BsModalService,
    private seoService: SeoService,
    private meta: MetaService ,
    private title : Title) {
      this.title.setTitle('الاأونا - الرئيسيه')
    this.seoService.createLinkForCanonicalURL();

  }
  ngOnInit() {
    // this.swiper.update(true);
    // this.swiper.config.autoplay = true;
    this.assignMetaTags();
    this.loadAllHomeSliders();
    this.getAllcategoriesWithProducts();
    this.getAllOffersGrouped();
  }
  assignMetaTags() {

    this.meta.setTag('author', 'alaunna');
    this.meta.setTag('description', 'الاأونا - افضل موقع وتطبيق لخدمه المتسخدم والتاجر في وقت واحد');
    this.meta.setTag('keywords', 'الاأونا , متاجر , منتجات , احذيه , ملابس');
    this.meta.setTag('og:title', 'ألاأونا - تسوق واستمتع بأفضل العروض');
    this.meta.setTag('og:type', 'website');
    this.meta.setTag('og:description', 'الاأونا - افضل موقع وتطبيق لخدمه المتسخدم والتاجر في وقت واحد');
    // this.meta.setTag('og:image',this.ImageBase + '/' + this.ProductData['images'][0].for + '/' + this.ProductData['images'][0].name);
    this.meta.setTag('og:url', 'https://alaunna.com');
    this.meta.setTag('og:image' , 'https://alaunna.com/api/images/Alaunna.png');
    this.meta.setTag('og:site_name', 'alaunna');

    this.meta.setTag('twitter:title', 'ألاأونا - تسوق واستمتع بأفضل العروض');
    this.meta.setTag('twitter:description', 'ألاأونا - تسوق واستمتع بأفضل العروض');
    // this.meta.setTag('twitter:image',this.ImageBase + '/' + this.ProductData['images'][0].for + '/' + this.ProductData['images'][0].name);
    this.meta.setTag('twitter:site', 'alaunna');
    this.meta.setTag('twitter:creator', 'alaunna');

  }
  loadAllHomeSliders() {
    this.bannerService.getAllBanners('website', 'home').subscribe(data => {
      console.log(data);
      this.SliderAds = data['data']['rows'];
    }, err => {

    });
  }

  getAllcategoriesWithProducts() {
    this.productController.getAllproductCategory(false, false, true, false, true).subscribe(data => {
      // console.log(data);
      if (data['status'] === 'success') {
        this.CategoriesProduct = data['data']['rows'];
      } else {

      }
    }, err => {

    });
  }


  getAllOffersGrouped() {
    this.productController.getAllProductsOffer(false, Date(), false).subscribe(data => {
      console.log(data);
      if (data['status'] === 'success') {
        this.Offers = data['data'];
        for (let i =0;i<this.Offers.length;i++ ){
          if (!this.Offers[i].data.length){
            this.Offers.splice(i,1 );
            i--;
          }
        }
      } else {

      }
    }, err => {
      // console.log(err);
    });
  }
  onProductClicked(offerOrProduct) {
    this.router.navigate(['/products/details/' + offerOrProduct.category.name + '/' +offerOrProduct.subCategory.name + '/' + offerOrProduct.id + '_' + offerOrProduct.name]);
  }
  openLink(link) {
    this.window.open(link);
  }

  onAddProductToFavorite(ProductData) {
    if (this.ProductInFavList) {
      return;
    }
    if (SharedStorage.current_user_data) {
      this.productController.addProductToFavorite(SharedStorage.current_user_data.id, ProductData.id).subscribe(data => {
        if (data['status'] == 'success') {
          SharedStorage.current_user_data['favorites'].push({ id: data['data']['id'], product_id: ProductData['id'] });
          this.ProductInFavList = true;
          this.snotify.success('تم اضافه المنتج بنجاح الي المفضله');
        } else {
          if (data['error']['action'] == 'exists-before') {
            this.snotify.warning('هذا المنتج موجود بالفعل في المفضله');
          }
        }
      }, err => {
        this.snotify.warning('حدثت مشكله عند اضافه المنتج الي المفضله برجاء التحقق من الاتصال بالانترنت واعاده المحاوله');
      })
    } else {
      this.snotify.warning('يجب ان تكون مسجل لكي تتمكن من الدخول لهذه الصفحه');
      this.router.navigate(['/auth/user-signup']);
    }
  }
}
