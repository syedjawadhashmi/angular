import { SharedStorage } from './../../../core/shared/storageShared';
import { BroadcasterService } from 'ng-broadcaster';
import { AuthenticationService } from './../../../core/shared/services/authentication.service';
// import { LocationService } from './../../../core/shared/services/location.service';
import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { SeoService } from './../../../core/shared/services/seo.service';
import { OneSignalService } from './../../../core/shared/services/OneSignalService';
import { Component, OnInit , Inject} from '@angular/core';

import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';
import swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  AllCountry;
  Cities;
  FilterdCities;

  UserData = {} as any;
  pageType = 'login';
  constructor(@Inject(WINDOW) private window: Window,
  @Inject(LOCAL_STORAGE) private localStorage: any,
  // private locationController: LocationService,
    private socialAuthService: AuthService,
    private authService: AuthenticationService,
    private router: Router,
    private broadCaster: BroadcasterService,
    private snotify: SnotifyService,
    private oneSignalservice : OneSignalService ,
    private seoService : SeoService ,
    private location : Location , private title : Title ) {
      this.title.setTitle('الاأونا - تسجيل الدخول');
      this.seoService.createLinkForCanonicalURL();
    // this.loadAllCities();
    // this.loadAllCountry();
  }

  ngOnInit() {
    if (SharedStorage.current_user_data && SharedStorage.current_user_data['category'] === 'seller') {
      this.pageType = 'market';
    }
  }
  onLoginClicked() {
    if (!this.UserData['phone'] || !this.UserData['password']) {
      this.snotify.warning('برجاء كتابه رقم الهاتف مع كلمه المرور');
      return;
    }
    this.UserData['device_id'] = SharedStorage.device_id;
    this.UserData['category'] = 'customer';
    this.authService.login(this.UserData).subscribe(data => {
      if (data['status'] === 'success') {
        var OneSignal = this.window['OneSignal'] || [];
        OneSignal.push(function () {
          OneSignal.sendTags(
            { type: 'customer' }
          );
        });
        // if (data['data']['category'] == 'seller') {
        //   this.router.navigate(['/auth/seller-login']);
        //   this.snotify.warning('برجاء قم بتسجيل الدخول في الصفحه الخاصه بالتاجر');
        //   return;
        // }
        this.oneSignalservice.init('customer' , data['data']['id'], '');
        if (this.UserData['remeberMe']) {
          this.localStorage.setItem('token', data['data']['token']);
        } else {
          this.localStorage.setItem('token', data['data']['token']);
        }
        SharedStorage.current_user_data = data['data'];
        if (SharedStorage.current_user_data['category'] === 'seller' && data['data']['Seller']['NumberOfMarkets'] === 0) {
          this.router.navigate(['/auth/add-market']);
          this.snotify.warning('يجب عليك اضافه المتجر الخاص بك');
          return;
        }
        this.broadCaster.broadcast('UserSign', {});
        // this.router.navigate(['/']);
          this.location.back();
        // this.router.navigate(["/"]);
      } else {
        this.snotify.warning('برجاء كتابه رقم الهاتف وكلمه المرور بشكل صحيح وتأكد انه تريد التسجيل كـ مستخدم عادي وليس تاجر');
      }
    }, err => {

    });
  }
  onSignupClicked() {
    // if (!this.UserData.image) {
    //   swal('خطأ', 'برجاء اختيار صوره للصفحه الشخصيه', 'error');
    //   return;
    // }
    // if (this.UserImagePreProccessing()) {
    //   swal('خطأ', 'برجاء اختيار صوره في حجم 220 220 ', 'error');
    //   return;
    // }
    if (this.UserData['password'] !== this.UserData['password_confirm']) {
      this.snotify.warning('برجاء كتابه كلمه مرور متطابقه');
      return;
    }
    this.UserData['category'] = 'customer';
    this.authService.signup(this.UserData).subscribe(data => {
      if (data['status'] === 'success') {
        this.snotify.success('تم تسجيل المستخدم بنجاح');
        this.localStorage.setItem('token', data['data']['token']);
        SharedStorage.current_user_data = data['data'];
        this.broadCaster.broadcast('UserSign', {});
        this.router.navigate(['/']);
      } else {
        // console.log(data);
        this.snotify.error('حدث مشكله برجاء التاكد من عدم تكرار رقم الهاتف');
      }
    }, err => {
      this.snotify.error('حدثت مشكله عند تسجيل جديد برجاء التحقق من الاتصال بالانترنت واعاده المحاوله');
    });
  }
  onNavigateClicked(Type) {
    this.pageType = Type;
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
  //       } else {
  //         this.snotify.error('حدثت مشكله عند تسجيل جديد برجاء التحقق من الاتصال بالانترنت واعاده المحاوله');
  //       }
  //     },
  //     err => {
  //       this.snotify.error('حدثت مشكله عند تسجيل جديد برجاء التحقق من الاتصال بالانترنت واعاده المحاوله');
  //     }
  //   );
  // }
  onCountryChange() {
    // console.log(this.Cities);
    this.FilterdCities = this.Cities.filter(x => {
      return x.countryId == this.UserData.country;
    });
  }
  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        // console.log(socialPlatform + " sign in data : ", userData);
        this.UserData = userData;
        this.UserData['image'] = undefined;
        if (socialPlatform == 'facebook') {
          this.UserData['facebook_id'] = userData.id;
          if (this.pageType == 'login') {
            this.varifySocialId({ facebook_id: userData.id });
          }
        } else {
          this.UserData['googleplus_id'] = userData.id;
          if (this.pageType == 'login') {
            this.varifySocialId({ googleplus_id: userData.id });
          }
        }
      }
    );
  }
  varifySocialId(UserData) {
    this.authService.varifySocial(UserData).subscribe(data => {
      // console.log(data);
      if (data['status'] === 'success') {
        SharedStorage.current_user_data = data['data'];
        this.localStorage.setItem('token', SharedStorage.current_user_data.token);
        this.broadCaster.broadcast('UserSign', {});
        // this.router.navigate(['/']);
        // this.router.
        this.location.back();
      } else {
        this.snotify.warning('انت غير مسجل برجاء تسجيل اولا');
        this.pageType = 'signup';
      }
    }, err => {
      this.snotify.error('هناك مشكله التحقق من الاتصال بالانتر نت واعاده المحاوله');
    });
  }
  onFileChanges(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files && file) {
      const reader: FileReader = new FileReader();
      reader.onload = x => {
        const base64 = reader['result'] as string;
        this.UserData['image'] = {
          base64: base64.split(',')[1],
          alt: 'alaunna',
          description: 'alaunna',
        };
      };
      reader.readAsDataURL(file);
    }

  }
  UserImagePreProccessing() {
    let haveError = false;
    let UserImage = document.getElementById('UserImage');
    let LogoRealSize = this.realImgDimension(UserImage);
    if (LogoRealSize.naturalHeight != 220 || LogoRealSize.naturalWidth != 220) {
      UserImage.classList.add('error');
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
