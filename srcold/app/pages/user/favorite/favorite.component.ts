import { Title } from '@angular/platform-browser';
import { SharedStorage } from './../../../core/shared/storageShared';
import { BroadcasterService } from 'ng-broadcaster';
import { sharedClass } from './../../../core/shared/sharedattrubite';
import { ProductsService } from './../../../core/shared/services/products.service';
import { SeoService } from './../../../core/shared/services/seo.service';
import { BsModalService } from 'ngx-bootstrap/modal';
// import { SelectPtoductOptionsComponent } from './../../../core/components/modales/select-ptoduct-options/select-ptoduct-options.component';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import swal from 'sweetalert2';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  offset = 0;

  favorites = [] as any;
  ImageBase = sharedClass.IMAGE_BASE_URL;
  math = Math;
  subscrib;
  offersType = {
    1: 'أحدث الموديلات',
    // 2:'عروض قطعه وقطعه',
    //   3: 'عروض قطعه وقطعتين',
    4: 'المنتجات المفضلة للزائرين',
    5: 'ألاأونا بتختارلك'
  };
  subScripe;
  constructor(public productservice: ProductsService,
    private router: Router,
    private snotify: SnotifyService,
    private brodcaster: BroadcasterService,
    private modelRef: BsModalService,
    private seoService: SeoService , private title : Title) {
      this.title.setTitle('الاأونا - عرض المفضله');
    this.seoService.createLinkForCanonicalURL();

  }
  ngOnInit() {
    if (SharedStorage.current_user_data) {
      this.getAllUserFavorite(SharedStorage.current_user_data['id'], this.offset);
    } else {
      this.snotify.warning('يجب عليك التسجيل لكي تتمكن من رؤويه هذه الصفحه');
      this.router.navigate(['/auth/user-login']);
    }
  }
  getAllUserFavorite(user_id, offset) {
    this.productservice.getAllFavorite(user_id, offset).subscribe(data => {
      if (data['status'] == 'success') {
        this.favorites = data['data']['rows'];
        // console.log(this.favorites);
      }
    }, err => {

    })
  }
  onDeleteCliced(favorite_id) {
    this.snotify.confirm('هل تريد ان تمسح هذا العنصر', {
      timeout: 5000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      buttons: [
        {
          text: 'تعم اريد', action: (toast) => {
            this.productservice.deletefavorite(favorite_id).subscribe(data => {
              if (data['status'] == 'success') {
                this.offset = 0;
                this.favorites = [];
                this.getAllUserFavorite(SharedStorage.current_user_data.id, this.offset);
                this.snotify.success('تم مسح العنصر بنجاح');
              } else {
                this.snotify.error('هناك مشكله عند مسح العنصر برجاء التحقق من الاتصال بالانترنت واعاده المحاوله');
              }
            }, err => {
              this.snotify.error('هناك مشكله عند مسح العنصر برجاء التحقق من الاتصال بالانترنت واعاده المحاوله');
            });
            this.snotify.remove(toast.id);
          }
        },
        {
          text: 'لا اريد', action: (toast) => {
            this.snotify.remove(toast.id);
          }
        }
      ]
    })
  }

}
