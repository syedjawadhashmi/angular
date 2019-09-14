import { Title } from '@angular/platform-browser';
import { MarketsService } from './../../../core/shared/services/markets.service';
import { AuthenticationService } from './../../../core/shared/services/authentication.service';
// import { LocationService } from './../../../core/shared/services/location.service';
import { sharedClass } from './../../../core/shared/sharedattrubite';
import { SharedStorage } from './../../../core/shared/storageShared';
import { SeoService } from './../../../core/shared/services/seo.service';
import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';

import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import * as places from 'places.js';
declare var Microsoft;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  PageType = 'show';
  UserData = SharedStorage.current_user_data;
  MarketData = {} as any;
  AllCountry;
  Cities;
  FilterdCities;
  currentImageId;
  curentUserPosition;
  ImageBase = sharedClass.IMAGE_BASE_URL;
  constructor(
    // private locationController: LocationService,
    private authService: AuthenticationService,
    private snotify: SnotifyService,
    private router: Router,
    private marketController: MarketsService,
    private seoService : SeoService  ,private title : Title ) {
      this.title.setTitle('الاأونا - الصفحه الشخصيه')
      this.seoService.createLinkForCanonicalURL();

    }

  ngOnInit() {
    // console.log(this.UserData);
    // this.loadAllCountry();
    // this.loadAllCities();
  }
  // loadAllCountry() {
  //   this.locationController.getAllCountry(false).subscribe(
  //     data => {
  //       if (data['status'] === 'success') {
  //         this.AllCountry = data['data']['rows'];
  //         this.locationController.Countries = data['data']['rows'];
  //       }
  //     },
  //     err => {

  //     }
  //   );
  // }
  // loadAllCities() {
  //   this.locationController.getAllcities(false).subscribe(
  //     data => {
  //       if (data['status'] === 'success') {
  //         this.Cities = data['data']['rows'];
  //         this.FilterdCities = data['data']['rows'];
  //         this.locationController.Cities = data['data']['rows'];
  //       }
  //     },
  //     err => {

  //     }
  //   );
  // }
  onCountryChange() {
    // console.log(this.Cities);
    this.FilterdCities = this.Cities.filter(x => {
      return x.countryId === this.UserData.Country_id;
    });
  }
  onEditClicked(pageType) {
    this.PageType = pageType;
    if (this.PageType == 'market') {
      if (SharedStorage.current_user_data && SharedStorage.current_user_data['category'] == 'seller') {
        this.MarketData = SharedStorage.current_user_data['markets'][0];
      } else {
        this.snotify.error('يجب عليك ان تضيف المتجر الخاص');
        this.router.navigate(['/auth/seller-singup']);
      }
      this.intializeMap();
    }
    // this.loadAllCountry();
    // this.loadAllCities();
  }
  onSaveClicked() {
    if (!this.UserData.password) {
      this.snotify.warning('برجاء كتابه كلمه المرور لكي يتم التعديل');
      return;
    }
    // console.log(this.UserData);
    if (this.UserData.newPassword && (this.UserData['newPassword'] !== this.UserData['newPasswordConfirmation'])) {
      this.snotify.warning('كلمه المرور الجديده لا تتطابق مع تأكيدها');
      return;
    }
    this.authService.EditUserProfile(this.UserData).subscribe(data => {
      if (data['status'] === 'success') {
        this.snotify.success('تم التعديل بنجاح');
        this.router.navigate(['/home']);
      } else {
        this.snotify.error('برجاء قم بكتابه البيانات المطلوبه');
      }
    }, err => {
      this.snotify.error('حدث مشكله اثناء التعديل برجاء اعاده المحاوله مره اخره بعد التأكد من الاتصال بالانترنت');
    });

  }
  onFileChanges(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files && file) {
      const reader: FileReader = new FileReader();
      reader.onload = x => {
        const base64 = reader['result'] as string;
        if (this.currentImageId == 'marketImage') {
          if (this.MarketData['Image']) {
            this.MarketData['Image']['base64'] = base64.split(',')[1];
            this.MarketData['Image']['action'] = 'edited';
          } else {
            this.MarketData['Image'] = {
              base64: base64.split(',')[1],
              alt: 'alaunna',
              description: 'alaunna',
              action: 'new'
            };
          }
        } else if (this.currentImageId == 'marketCover') {
          if (this.MarketData.cover) {
            this.MarketData['cover']['base64'] = base64.split(',')[1];
            this.MarketData['cover']['action'] = 'edited';
          } else {
            this.MarketData['cover'] = {
              base64: base64.split(',')[1],
              alt: 'alaunna',
              description: 'alaunna',
              action: 'new'
            }
          }
        }
        else if (this.currentImageId == 'userImage') {
          if (this.UserData.Image) {
            this.UserData['Image']['base64'] = base64.split(',')[1];
            this.UserData['Image']['action'] = 'edited';
          } else {
            this.UserData['Image'] = {
              base64: base64.split(',')[1],
              alt: 'alaunna',
              description: 'alaunna',
              action: 'new'
            };
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }
  ongetNewImage(image_id) {
    this.currentImageId = image_id;
    document.getElementById('file').click();
  }
  onEditMarketData() {
    this.marketController.editMarket(this.MarketData).subscribe(data => {
      if (data['status'] == 'success') {
        swal('تم', 'تم التعديل بنجاح', 'success');
        this.router.navigate(['/home']);
      } else {
        swal('خطأ', 'لا يمكن تعديل البيانات , برجاء التحقق من صحه البيانات واعاده المحاوله', 'error');
      }
    }, err => {
      swal('خطأ', 'لا يمكن تعديل البيانات , برجاء التحقق من صحه البيانات واعاده المحاوله', 'error');
    })
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

}
