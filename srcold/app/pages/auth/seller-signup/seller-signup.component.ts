import { Title } from '@angular/platform-browser';
import { BroadcasterService } from 'ng-broadcaster';
import { SharedStorage } from './../../../core/shared/storageShared';
// import { LocationService } from './../../../core/shared/services/location.service';
import { MarketsService } from './../../../core/shared/services/markets.service';
import { AuthenticationService } from './../../../core/shared/services/authentication.service';
import { ProductsService } from './../../../core/shared/services/products.service';
import { SeoService } from './../../../core/shared/services/seo.service';
import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';

import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';

import * as places from 'places.js';
declare var Microsoft;

@Component({
  selector: 'app-seller-signup',
  templateUrl: './seller-signup.component.html',
  styleUrls: ['./seller-signup.component.css']
})
export class SellerSignupComponent implements OnInit {


  categories;
  MarketData = {} as any;
  SellerData = {} as any;

  AllCountry;
  Cities;
  FilterdCities;

  PageType = 'seller';
  curentUserPosition;

  currentImageId;
  constructor(private productController: ProductsService,
    private marketController: MarketsService,
    private authenticationController: AuthenticationService,
    // private locationController: LocationService,
    private snotify: SnotifyService,
    private router: Router, private broadcaster: BroadcasterService,
    private seoService: SeoService , private title : Title) {
      this.title.setTitle('الاأونا - تسجيل جديد للتاجر')
    this.seoService.createLinkForCanonicalURL();
    this.broadcaster.on('UserSign').subscribe(() => {
      if (SharedStorage.current_user_data &&
        SharedStorage.current_user_data['category'] === 'seller' &&
        !SharedStorage.current_user_data['Seller']['NumberOfMarkets']) {
        this.PageType = 'market';
        this.MarketData['Owner_id'] = SharedStorage.current_user_data['id'];
        this.MarketData['marketcategory_id'] = SharedStorage.current_user_data['Seller']['category_market'];

        // document.getElementById(SharedStorage.current_user_data['Seller']['category_market']).classList.add('active');
      }
    })
    this.geAllCategory();
    this.loadAllCountry();
    this.loadAllCities();
  }

  ngAfterViewInit() {
    if (SharedStorage.current_user_data &&
      SharedStorage.current_user_data['category'] === 'seller' &&
      !SharedStorage.current_user_data['Seller']['NumberOfMarkets']) {
      this.PageType = 'market';
      this.MarketData['Owner_id'] = SharedStorage.current_user_data['id'];
      this.MarketData['marketcategory_id'] = SharedStorage.current_user_data['Seller']['category_market'];

      // document.getElementById(SharedStorage.current_user_data['Seller']['category_market']).classList.add('active');
    }
  }
  ngOnInit() {
    this.intializeMap();
  }
  intializeMap() {
    navigator.geolocation.getCurrentPosition(success => {
      this.curentUserPosition = new Microsoft.Maps.Location(
        success.coords.latitude,
        success.coords.longitude
      );
      const map = new Microsoft.Maps.Map(document.getElementById('myMap'), {});
      const pushpin = new Microsoft.Maps.Pushpin(this.curentUserPosition, { 'draggable': true });
      map.entities.push(pushpin);
      const placesAutocomplete = places({
        container: document.querySelector('#address-input')
      });
      placesAutocomplete.on('change', e => {
        const newPosition = new Microsoft.Maps.Location(
          e.suggestion.latlng.lat,
          e.suggestion.latlng.lng
        );
        pushpin.setLocation(newPosition);
        map.setView({ center: newPosition });
        this.MarketData['lat'] = newPosition.latitude;
        this.MarketData['lng'] = newPosition.longitude;
      });
      Microsoft.Maps.Events.addHandler(pushpin, 'dragend', (event) => {
        // console.log(event);
        this.MarketData['lat'] = event['location']['latitude'];
        this.MarketData['lng'] = event['location']['longitude'];
      });
    });
  }
  geAllCategory() {
    if (SharedStorage.product_categories.length) {
      this.categories = SharedStorage.product_categories;
      return;
    }
    this.productController.getAllproductCategory(false, false, false, false, '').subscribe(data => {
      if (data['status'] === 'success') {
        this.categories = data['data']['rows'];
      } else {
        this.snotify.error('هناك مشكله برجاء التأكد من الاتصال بالانترنت واعاده المحاوله');
      }
    }, err => {
      this.snotify.error('هناك مشكله برجاء التأكد من الاتصال بالانترنت واعاده المحاوله');
    });
  }

  loadAllCountry() {
    // this.locationController.getAllCountry(false).subscribe(
    //   data => {
    //     if (data['status'] === 'success') {
    //       this.AllCountry = data['data']['rows'];
    //       this.locationController.Countries = data['data']['rows'];
    //     }
    //   },
    //   err => {

    //   }
    // );
  }
  loadAllCities() {
    // this.locationController.getAllcities(false).subscribe(
    //   data => {
    //     if (data['status'] === 'success') {
    //       this.Cities = data['data']['rows'];
    //       this.FilterdCities = data['data']['rows'];
    //       this.locationController.Cities = data['data']['rows'];
    //     }
    //   },
    //   err => {

    //   }
    // );
  }
  onCountryChange() {
    // console.log(this.Cities);
    this.FilterdCities = this.Cities.filter(x => {
      if (this.PageType == 'seller') {
        return x.countryId == this.SellerData.country;
      } else {
        // console.log(this.MarketData.Country_id);
        // console.log(x.countryId);
        return x.countryId == this.MarketData.Country_id;
      }
    });
  }
  onCategorySelected(cat) {
    this.SellerData['category_market'] = cat.id;
    this.MarketData['marketcategory_id'] = cat.id;

    for (let i = 0; i < this.categories.length; i++) {
      document.getElementById(this.categories[i].id).classList.remove('active');
    }
    document.getElementById(cat.id).classList.add('active');

  }
  onSignupClicked() {
    console.log(this.SellerData);
    if (this.SelerImagePreProcessing()) {
      swal('خطأ', 'برجاء اختيار صوره ذات جوده جيده وان تكون ابعاد الصوره تساوي 220 X 220', 'error');
      return;
    }
    if (!this.SellerData['category_market']) {
      this.snotify.warning('برجاء قم بأختيار تصنيف المتجر');
      return;
    }
    if (this.SellerData['password'] !== this.SellerData['password_confirm'] || !this.SellerData['password']) {
      this.snotify.warning('كلمه المرور وتكرراها لا تتطبقان');
      return;
    }
    if (!this.SellerData['country']) {
      this.snotify.warning('برجاء اختيار المحافظه والمدينه');
      return;
    }
    this.SellerData['category'] = 'seller';
    this.authenticationController.signup(this.SellerData).subscribe(data => {
      if (data['status'] === 'success') {
        this.PageType = 'seller';
        // this.MarketData['Country_id'] = this.SellerData['country'];
        // this.MarketData['City_id'] = this.SellerData['city'];
        this.MarketData['Owner_id'] = data['data']['id'];
        this.router.navigate(['/auth/seller-login']);
        this.snotify.success('تم تسجيل صاحب المتجر بنجاح');
      } else {
        // console.log(data);
        this.snotify.error('رقم الهاتف مستخدم من قبل برجاء التاكد من صحه البيانات واعاده المحاوله');
      }
    }, err => {
      this.snotify.error('حدثت مشكله عند تسجيل كـ صاحب متجر برجاء التحقق من الاتصال بالانترنت واعاده المحاوله');
    });
  }
  onFileChanges(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files && file) {
      const reader: FileReader = new FileReader();
      reader.onload = x => {
        const base64 = reader['result'] as string;
        if (this.PageType === 'seller') {
          this.SellerData['image'] = {
            base64: base64.split(',')[1],
            alt: 'allaaona',
            description: 'allaaona',
          };
        } else {
          this.MarketData[this.currentImageId] = {
            base64: base64.split(',')[1],
            alt: 'allaaona',
            description: 'allaaona',
          };
        }
      };
      reader.readAsDataURL(file);
    }
  }
  onAddMarketClicked() {
    if (!this.MarketData['marketcategory_id']) {
      this.snotify.warning('برجاء اختيار نوع المتجر الخاص بك اولا');
      return;
    }
    if (!this.MarketData['image']) {
      this.snotify.warning('برجاء اضافه اللوجو للمتجر');
      return;
    }
    if (!this.MarketData['cover']) {
      this.snotify.warning('برجاء اضافه كوفر للمتجر');
      return;
    }
    if (this.MarketImagePreProccessing()) {
      swal('خطأ', 'يجب ان يكون كوفر المتجر في حجم 1024 X 500 وان يكون حجم صوره لوجو المتجر 220 X 220', 'error');
      return;
    }
    this.MarketData['class'] = 'small';
    this.marketController.addnewMarket(this.MarketData).subscribe(data => {
      if (data['status'] === 'success') {
        // console.log(data);
        this.router.navigate(['/']);
        location.reload();
      } else {
        this.snotify.error('برجاء كتابه بيانات المتجر كامله لكي تتم عمليه الاضافه بنجاح');
      }
    }, err => {
      this.snotify.error('هناك مشكله برجاء التحقق من الاتصال بالانترنت واعاده المحاوله');
    });
  }
  ongetNewImage(image_id) {
    this.currentImageId = image_id;
    document.getElementById('file').click();
  }
  SelerImagePreProcessing() {
    let HavError = false;
    let SellerImage = document.getElementById('sellerImage');
    if (!SellerImage) {
      return true;
    }
    SellerImage.classList.remove('error');
    let realSize = this.realImgDimension(SellerImage);
    if (realSize.naturalHeight != 220 || realSize.naturalWidth != 220) {
      SellerImage.classList.add('error');
      HavError = true;
    }
    return HavError;
  }
  MarketImagePreProccessing() {
    let haveError = false;
    let MarketCover = document.getElementById('MarketCover');
    let MarketLogo = document.getElementById('MarketLogo');
    let CoverRealSize = this.realImgDimension(MarketCover);
    let LogoRealSize = this.realImgDimension(MarketLogo);
    if (CoverRealSize.naturalWidth != 1024 || CoverRealSize.naturalHeight != 500) {
      MarketCover.classList.add('error');
      haveError = true;
    }
    if (LogoRealSize.naturalHeight != 220 || LogoRealSize.naturalWidth != 220) {
      MarketLogo.classList.add('error');
      haveError = true;
    }
    return haveError;
  }
  realImgDimension(img) {
    var i = new Image();
    i.src = img.src;
    return {
      naturalWidth: i.width,
      naturalHeight: i.height
    };
  }
}
