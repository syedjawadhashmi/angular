import { SharedStorage } from './../../../core/shared/storageShared';
import { BroadcasterService } from 'ng-broadcaster';
import { AuthenticationService } from './../../../core/shared/services/authentication.service';
import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { SeoService } from './../../../core/shared/services/seo.service';
import { OneSignalService } from './../../../core/shared/services/OneSignalService';
import { Component, OnInit , Inject} from '@angular/core';

import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-seller-login',
  templateUrl: './seller-login.component.html',
  styleUrls: ['./seller-login.component.css']
})
export class SellerLoginComponent implements OnInit {

  UserData = {} as any;
  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any,
    //private socialAuthService: AuthService,
    private authService: AuthenticationService,
    private broadCaster: BroadcasterService,
    private router: Router,
    private notify: SnotifyService,
    private oneSignalService : OneSignalService,
    private seoService : SeoService , private location : Location , private title  : Title) {
      this.title.setTitle('الاأونا - تسجل الدخول للتاجر');
      this.seoService.createLinkForCanonicalURL();
    }

  ngOnInit() { }
  varifySocialId(UserData) {
    this.authService.varifySocial(UserData).subscribe(
      data => {
        // console.log(data);
        if (data["status"] == "success") {
          var OneSignal = this.window['OneSignal'] || [];
          OneSignal.push(function () {
            OneSignal.sendTags(
              { type: 'seller' }
            );
          });
          SharedStorage.current_user_data = data["data"];
          this.localStorage.setItem(
            "token",
            SharedStorage.current_user_data.token
          );
          this.broadCaster.broadcast("UserSign", {});
          this.router.navigate(["/"]);
        } else {
          this.notify.error("انت غير مسجل برجاء تسجيل اولا");
        }
      },
      err => {
        this.notify.error(
          "هناك مشكله التحقق من الاتصال بالانتر نت واعاده المحاوله"
        );
      }
    );
  }
  onLoginClicked() {
    if (!this.UserData["phone"] || !this.UserData["password"]) {
      this.notify.warning("برجاء كتابه رقم الهاتف مع كلمه المرور");
      return;
    }
    this.UserData["device_id"] = SharedStorage.device_id;
    this.UserData['category'] = 'seller';
    this.authService.login(this.UserData).subscribe(
      data => {
        if (data["status"] == "success") {
          var OneSignal = window['OneSignal'] || [];
          OneSignal.push(function () {
            OneSignal.sendTags(
              { type: 'seller' }
            );
          });
          // if (data["data"]["category"] == "customer") {
          //   this.router.navigate(["/auth/user-login"]);
          //   this.notify.warning(
          //     "برجاء قم بتسجيل دخول من صفحه الخاصه بالمستخدم"
          //   );
          // }
          this.oneSignalService.init('seller' , data['data']['id'] , data['data']['markets'][0].id);
          if (this.UserData["remeberMe"]) {
            this.localStorage.setItem("token", data["data"]["token"]);
          } else {
            this.localStorage.setItem("token", data["data"]["token"]);
          }
          SharedStorage.current_user_data = data["data"];
          this.broadCaster.broadcast("UserSign", {});
          // console.log(SharedStorage.current_user_data);
          if (SharedStorage.current_user_data["Seller"]["NumberOfMarkets"]) {
            // this.router.navigate(["/"]);
            this.location.back();
          } else {
            this.router.navigate(["/auth/seller-signup"]);
            this.notify.warning("يجب عليك اضافه المتجر الخاص بك");
          }
        } else {
          this.notify.warning(
            "برجاء كتابه رقم الهاتف وكلمه المرور بشكل صحيح او التأكد انك تريد الدخول كتاجر وليس  كمستخدم عادي"
          );
        }
      },
      err => { }
    );
  }
  // public socialSignIn(socialPlatform: string) {
  //   let socialPlatformProvider;
  //   if (socialPlatform == "facebook") {
  //     socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
  //   } else if (socialPlatform == "google") {
  //     socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
  //   }
  //   this.socialAuthService.signIn(socialPlatformProvider).then(
  //     (userData) => {
  //       // console.log(socialPlatform + " sign in data : ", userData);
  //       this.UserData = userData;
  //       if (socialPlatform == 'facebook') {
  //         this.UserData['facebook_id'] = userData.id;
  //         this.varifySocialId({ facebook_id: userData.id });
  //       } else {
  //         this.UserData['googleplus_id'] = userData.id;
  //         this.varifySocialId({ googleplus_id: userData.id });
  //       }
  //     }
  //   );
  // }
}
