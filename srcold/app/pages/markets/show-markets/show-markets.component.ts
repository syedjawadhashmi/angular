import { Title } from '@angular/platform-browser';
import { sharedClass } from './../../../core/shared/sharedattrubite';
import { SharedStorage } from './../../../core/shared/storageShared';
// import { LocationService } from './../../../core/shared/services/location.service';
import { MarketsService } from './../../../core/shared/services/markets.service';
import { SeoService } from './../../../core/shared/services/seo.service';
import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { HelperToolsService } from './../../../core/shared/services/helper-tools.service';
import { MetaService } from '@ngx-meta/core';

@Component({
  selector: 'app-show-markets',
  templateUrl: './show-markets.component.html',
  styleUrls: ['./show-markets.component.css']
})
export class ShowMarketsComponent implements OnInit {

  Markets = [] as any;
  offset = 0;
  LoadMore = true;

  ImageBase = sharedClass.IMAGE_BASE_URL;
  category_id = false;

  math = Math;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  geoFitler = false;
  IsLoading = false;

  country_id = false;
  city_id = false;

  AllCountry;
  Cities;
  FilterdCities;
  settingData;
  constructor(private marketController: MarketsService,
    private router: Router,
    private route: ActivatedRoute,
    // private locationController: LocationService,
    private snotify: SnotifyService, 
    private seoService: SeoService , 
    private titleService : Title,
    private helperTools : HelperToolsService, private meta : MetaService ) {

    this.seoService.createLinkForCanonicalURL();
  }

  async ngOnInit() {
    this.titleService.setTitle('الاأونا - متاجر');

    this.settingData = await this.helperTools.getSetting();

    this.meta.setTag('description' , this.settingData.markets_meta_description);
    this.meta.setTag('og:description' , this.settingData.markets_meta_description);
    this.meta.setTag('keywords' , this.settingData.markets_meta_keyword);

    this.route.queryParams.subscribe(params => {
      if (params['category_id']) {
        this.category_id = params['category_id'];
      }
      if (params['geo-filter']) {
        this.geoFitler = params['geo-filter'];
        this.loadAllCountry();
        this.loadAllCities();
      } else {
        this.geoFitler = false;
      }
      this.route.params.subscribe(data => {
        if (data['category_name']){
          this.category_id = data['category_name'].split('-')[0];
          this.titleService.setTitle('الاأونا - ' + data['category_name']);
        }
        if (data['country_name']){
          this.country_id = data['country_name'].split('-')[0];
        }
        this.loadAllMarkets();
      })
      this.loadAllMarkets();
    });
  }
  loadAllMarkets() {
    this.IsLoading = true;
    this.marketController.getAllmarkets(this.offset, false, this.category_id, this.country_id, this.city_id, 'active').subscribe(data => {
      console.log(data);
      this.IsLoading = false;
      if (data['status'] == 'success') {
        if (this.offset == 0) {
          this.Markets = data['data']['rows'];
        } else {
          this.Markets = this.Markets.concat(data['data']['rows']);
          if (data['data']['rows'].length == 0){
            this.LoadMore = false;
          }
        }
      }
    }, err => {

    });
  }
  onMarketDetailsClicked(marekt) {
    SharedStorage.current_makret_data = marekt;
    this.router.navigate(['/markets/details/' + marekt.id + '_' + marekt.name]);
  }
  onScroll() {
    if (!this.IsLoading) {
      this.offset++;
      this.loadAllMarkets();
    }
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
      return x.countryId == this.country_id;
    });
    this.loadAllMarkets();
  }
  onCityChnage() {
    this.loadAllMarkets();
  }
  onGeoPressed() {
    this.Markets = [];
    if (!navigator.geolocation) {
      this.snotify.error('هذا المتصفح لا يدعم التقاط المكان الخاص بك');
    }
    navigator.geolocation.getCurrentPosition(success => {
      this.marketController.getlocationFitler(success.coords.latitude, success.coords.longitude, 10000).subscribe(data => {
        if (data['status'] == 'success') {
          this.Markets = data['data'];
        } else {
          this.snotify.warning('لا يوجد اي متجر بالقرب منك');
        }
      }, err => {
        this.snotify.error('حدثت مشكله عند احضار المتاجر القريبه منك برجاء اعاده المحاوله بعد التحقق من الاتصال بالانترنت');
      })
    }, err => {
      this.snotify.error('هذا المتصفح لا يدعم التقاط المكان الخاص بك');

    })

  }
}
