import { SharedStorage } from './../../core/shared/storageShared';
import { AuthenticationService } from './../../core/shared/services/authentication.service';
// import { LocationService } from './../../core/shared/services/location.service';
import { ProductsService } from './../../core/shared/services/products.service';
import { sharedClass } from './../../core/shared/sharedattrubite';
import { BannerService } from './../../core/shared/services/banner.service';
import { Component, OnInit } from '@angular/core';
import { BroadcasterService } from 'ng-broadcaster';


import { SwiperConfigInterface } from 'ngx-swiper-wrapper';


import { Title } from '@angular/platform-browser';
import { AuthService } from 'angular-6-social-login';

import { Router } from '@angular/router';
import { HelperToolsService } from './../../core/shared/services/helper-tools.service';
import { MetaService } from '@ngx-meta/core';

@Component({
  selector: 'app-new-home',
  templateUrl: './new-home.component.html',
  styleUrls: ['./new-home.component.css']
})
export class NewHomeComponent implements OnInit {

  selectedCategory = {} as any;
  selectedCountry = {} as any;
  filterData = { country_id: '', category_id: '' };

  categories = [];
  countries;
  Swiperconfig: SwiperConfigInterface;
  ImageBase = sharedClass.IMAGE_BASE_URL;
  banners = [];
  userData = {} as any;
  settingData = {} as any;
  sharedStorage = SharedStorage;
  constructor(private broadCaster: BroadcasterService,
    private productController: ProductsService,
    // private locationController: LocationService, 
    private bannerService: BannerService , 
    private title : Title , 
    private router : Router,
    private helperTools  : HelperToolsService , private meta : MetaService) { }

  async ngOnInit() {
    this.title.setTitle('الأونا - الصفحه الرئيسيه');
    this.settingData =  await this.helperTools.getSetting();

    this.meta.setTag('description' , this.settingData.home_meta_description);
    this.meta.setTag('og:description' , this.settingData.home_meta_description);
    this.meta.setTag('keywords' , this.settingData.home_meta_keyword);
    this.loadAllProductCategory();
    this.loadAllCountry();
    this.loadAllBanners();
    
  }
  _toggleSidebar() {
    this.broadCaster.broadcast('toggleMenu');
  }
  loadAllProductCategory() {
    this.productController.getAllproductCategory('', '', '', '', '').subscribe(data => {
      console.log(data);
      if (data['status'] === 'success' && data['data']) {
        this.categories = data['data']['rows'];
        // SharedStorage.product_categories = data['data']['rows'];
      } else {
      }
    },
      err => {

      }
    );
  }
  loadAllCountry() {
    // this.locationController.getAllCountry(false).subscribe(
    //   data => {
    //     if (data['status'] === 'success') {
    //       this.countries = data['data']['rows'];
    //       // this.locationController.Countries = data['data']['rows'];
    //     }
    //   },
    //   err => {

    //   }
    // );
  }
  loadAllBanners() {
    this.bannerService.getAllBanners('website', 'home').subscribe(data => {
      console.log(data);
      this.banners = data['data']['rows'];
      this.banners = this.banners.splice(0,6);
      this.Swiperconfig = {
        direction: "horizontal",
        allowSlideNext: true,
        allowSlidePrev: true,
        //spaceBetween: 30,
        loop: false,
        navigation: true,
        slidesPerView: 3,
        autoplay : true,
        // pagination: {
        //   el: '.swiper-pagination',
        //   clickable: true,
        // },
        //autoplay: true,
        //autoHeight: true,
        // height: 350,
        // slidePrevClass : 'prev-class',
        // slideNextClass : 'next-class',
        breakpoints: {
          // when window width is <= 320px
          // 320: {
          //   slidesPerView: 1,
          //   spaceBetween: 10
          // },
          // when window width is <= 480px
          // 480: {
          //   slidesPerView: 2,
          //   spaceBetween: 20
          // },
          // when window width is <= 640px
          768: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          1000: {
            slidesPerView: 6,
            spaceBetween: 30
          },
          10000: {
            slidesPerView: 6,
            spaceBetween: 30
          }
        }
      };
    }, err => {

    });
 
  }
  onGoToProfile(){
    if (SharedStorage.current_user_data){
      this.router.navigate(['/user/profile']);
      
    } else {
      this.broadCaster.on('UserSign').subscribe(data => {
        this.userData = SharedStorage.current_user_data;
      })
      this.router.navigate(['/auth/user-login'])
    }
  }
}
