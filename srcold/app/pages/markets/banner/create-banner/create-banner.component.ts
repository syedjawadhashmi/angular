import { Title } from '@angular/platform-browser';
import { SharedStorage } from './../../../../core/shared/storageShared';
import { MarketsService } from './../../../../core/shared/services/markets.service';
import { SeoService } from './../../../../core/shared/services/seo.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';

import swal from 'sweetalert2';

@Component({
  selector: 'app-create-banner',
  templateUrl: './create-banner.component.html',
  styleUrls: ['./create-banner.component.css']
})
export class CreateBannerComponent implements OnInit {


  BannerData = {} as any;
  MarketData;
  constructor(private router: Router,
    private marketController: MarketsService,
    private snotify: SnotifyService,
    private seoService: SeoService ,private title : Title) {
      this.title.setTitle('الأونا - اضافه اعلان جديد')
    this.seoService.createLinkForCanonicalURL();
  }

  ngOnInit() {
    if (SharedStorage.current_user_data && SharedStorage.current_user_data['category'] == 'seller') {
      this.MarketData = SharedStorage.current_user_data['markets'][0];
    } else {
      this.snotify.error('يجب عليك ان تضيف المتجر الخاص');
      this.router.navigate(['/auth/seller-singup']);
    }
  }
  onFileChanges(evt) {
    var files = evt.target.files;
    var file = files[0];
    if (files && file) {
      var reader: FileReader = new FileReader();
      reader.onload = x => {
        var base64 = reader["result"] as string;
        this.BannerData['image'] = {
          base64: base64.split(",")[1],
          alt: 'allaaona',
          description: 'allaaona',
        }
      }
      reader.readAsDataURL(file);
    };

  }
  onAddClicked() {
    if (!this.BannerData.title || !this.BannerData.image || !this.BannerData.description) {
      this.snotify.warning('برجاء اضافه البيانات الناقصه');
      return;
    }
    if (this.ImagePreProccessing()) {
      swal('خطأ', 'برجاء اختيار صوره حجم 1024 X 500', 'error');
      return;
    }
    this.BannerData['market_id'] = this.MarketData['id'];
    this.marketController.addNewMarketBanner(this.BannerData).subscribe(data => {
      // console.log(data);
      if (data['status'] == 'success') {
        this.snotify.success('تم اضافه البنر بنجاح سوف يتم المراجعه والتواصل مره اخري');
        this.router.navigate(['/home']);
      } else {
        if (data['error']['action'] == 'invalid-banners-counter') {
          this.snotify.error('لا يمكنك اضافه اكتر من 3 اعلانات لمتجرك');
          return;
        }
        this.snotify.error('حدث خطئ عند اضافه البانر برجاء اعاده المحاوله  والتحقق من الاتصال بالانترنت');
      }
    }, err => {
      this.snotify.error('حدث خطئ عند اضافه البانر برجاء اعاده المحاوله  والتحقق من الاتصال بالانترنت');
    })
  }
  ImagePreProccessing() {
    let HaveError = false;
    let ImageEl = document.getElementById('Banner');
    ImageEl.classList.remove('error');
    var realSize = this.realImgDimension(ImageEl);
    if (realSize.naturalHeight != 500 || realSize.naturalWidth != 1024) {
      ImageEl.classList.add('error');
      HaveError = true;
    }
    return HaveError;
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
