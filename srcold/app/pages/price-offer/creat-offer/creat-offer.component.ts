import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { ProductsService } from '../../../core/shared/services/products.service';
// import { LocationService } from '../../../core/shared/services/location.service';
import { SnotifyService } from 'ng-snotify';
import { MarketsService } from '../../../core/shared/services/markets.service';
import { sharedClass } from '../../../core/shared/sharedattrubite';
import { PriceOfferService } from '../../../core/shared/services/price-offer.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SharedStorage } from '../../../core/shared/storageShared';

@Component({
  selector: 'app-creat-offer',
  templateUrl: './creat-offer.component.html',
  styleUrls: ['./creat-offer.component.css']
})
export class CreatOfferComponent implements OnInit {

  priceForm: FormGroup;
  priceData = {} as any;

  categories = [];
  countries = [];

  markets = [];

  selectedMarketsWrapper = {} as any;
  selectedMarkets = [];
  ImageBase = sharedClass.IMAGE_BASE_URL;

  all_market = false;
  x;
  constructor(private productController: ProductsService,
    // private locationController: LocationService,
    private snotify: SnotifyService,
    private marketController: MarketsService,
    private priceOfferController: PriceOfferService, private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.loadAllCountry();
    this.geAllCategory();
    this.getAllMarkets();
  }
  initForm() {
    this.priceForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      category_id: new FormControl(null, [Validators.required]),
      country_id: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    }, {
        updateOn: 'blur'
      })
  }
  geAllCategory() {
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
    //       this.countries = data['data']['rows'];
    //       this.locationController.Countries = data['data']['rows'];
    //     }
    //   },
    //   err => {

    //   }
    // );
  }
  getAllMarkets() {
    this.marketController
      .getAllmarkets(false, "name,id", false, false, false, "active")
      .subscribe(
        data => {
          // console.log(data);
          if (data["status"] == "success") {
            this.markets = data["data"]["rows"];
          }
        },
        err => { }
      );
  }
  onSelectChange(market_id) {
    // console.log(this.selectedMarketsWrapper[market_id])
    // console.log(this.selectedMarketsWrapper);
    if (this.selectedMarketsWrapper[market_id]) {
      this.selectedMarkets.push(market_id);
    } else {
      this.selectedMarkets.splice(this.selectedMarkets.indexOf(market_id), 1);
    }
    console.log(this.selectedMarkets);
  }
  onFileChanges(evt) {
    const files = evt.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (files && file) {
        const reader: FileReader = new FileReader();
        reader.onload = x => {
          const base64 = reader['result'] as string;
          // if (!this.ProductData.images) {
          //   this.ProductData['images'] = [];
          // }
          // this.ProductData.images.push({
          //   base64: base64.split(',')[1],
          //   alt: 'alaunna image',
          //   description: 'alaunna image',
          // });
          this.priceData['image'] = {
            base64: base64.split(',')[1],
            alt: 'alaunna image',
            description: 'alaunna image',
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }
  onAllMarketChange() {
    console.log(this.all_market);

    if (this.all_market) {
      this.priceData['for'] = 'some_markets';
      this.all_market = false;
    } else {
      this.priceData['for'] = 'all_market';
      this.all_market = true;
    }
  }
  onsubmit() {
    if (this.priceData.for != 'all_market') {
      this.priceData['makrets'] = this.selectedMarkets;
    }
    this.priceData['user_id'] = SharedStorage.current_user_data['id'];
    this.priceOfferController.create(this.priceData).subscribe(data => {
      if (data['status'] == 'success') {
        swal('تم', 'تم اضافه العنصر بنجاح', 'success');
        this.router.navigate(['price-offer/show']);
      } else {
        this.snotify.error('هناك مشكله برجاء التأكد من الاتصال بالانترنت واعاده المحاوله');
      }
    }, err => {
      this.snotify.error('هناك مشكله برجاء التأكد من الاتصال بالانترنت واعاده المحاوله');
    })
  }

}
