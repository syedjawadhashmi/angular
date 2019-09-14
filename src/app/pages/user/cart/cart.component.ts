import { SharedStorage } from './../../../core/shared/storageShared';
import { BroadcasterService } from 'ng-broadcaster';
import { sharedClass } from './../../../core/shared/sharedattrubite';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { SeoService } from './../../../core/shared/services/seo.service';
import { ConfirmOrderComponent } from './../../../core/components/modales/confirm-order/confirm-order.component';
import { Component, OnInit , Inject} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  CartData = {} as any;
  math = Math;

  Arr = Array;
  ImageBase = sharedClass.IMAGE_BASE_URL;
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private broadCaster: BroadcasterService,
    private modalService: BsModalService,
    private router: Router,
    private snotify: SnotifyService,private seoService : SeoService , private title : Title ) {
      this.title.setTitle('الاأونا - سله المشتريات')
      this.seoService.createLinkForCanonicalURL();

  }

  ngOnInit() {
    this.getCartItems();
  }
  getCartItems() {
    if (SharedStorage.current_user_cart.market_id == -1) {
      let CartItems = JSON.parse(this.localStorage.getItem('CartItems'));
      if (CartItems) {
        this.CartData = CartItems;
        this.UpdateCart();
        return;
      }
    }
    this.CartData = SharedStorage.current_user_cart;
    // console.log(this.CartData);
  }
  onDeleteCliced(i) {
    this.CartData['productsData'].splice(i, 1);
    this.CartData['products'].splice(i, 1);
    this.localStorage.setItem('CartItems', JSON.stringify(this.CartData));
    SharedStorage.current_user_cart = this.CartData;
    this.UpdateCart();
    this.broadCaster.broadcast('CartChanged');
  }
  UpdateCart() {
    let total_price: number = 0;
    let total_items = this.CartData['products'].length;
    let total_quantity = 0;
    if (this.CartData['products'].length == 0) {
      SharedStorage.current_user_cart = { total_price: 0, total_quantity: 0, total_items: 0, sutiable_place: '', sutiable_time: '', products: [], productsData: [], market_id: -1, marketData: {} };
      this.CartData = SharedStorage.current_user_cart;
      this.localStorage.setItem('CartItems', JSON.stringify(this.CartData));
    }
    for (let i = 0; i < this.CartData['products'].length; i++) {
      let ProductPrice = parseFloat(this.CartData['productsData'][i]['market'][0].Market_Products['Selling_price']);
      if (this.CartData['productsData'][i].offer) {
        let offer = this.CartData['productsData'][i].offer;
        if (offer.offer_type == 1 || offer.offer_type == 4 || offer.offer_type == 5) {
          total_price += (this.CartData['products'][i].quantity * (ProductPrice - (ProductPrice * (parseFloat(this.CartData['productsData'][i].offer.value) / 100))));
        } else if (offer.offer_type == 2) {
          total_price = (parseInt(this.CartData['products'][i].quantity) / 2) * ProductPrice;
        } else if (offer.offer_type == 3) {
          total_price = (parseInt(this.CartData['products'][i].quantity) / 3) * ProductPrice;
        }
      } else {
        total_price += (parseInt(this.CartData['products'][i].quantity) * ProductPrice);
      }
      total_quantity += parseInt(this.CartData['products'][i].quantity);
      // console.log(total_price);
    }
    this.CartData['total_items'] = total_items;
    this.CartData['total_price'] = total_price;
    this.CartData['total_quantity'] = total_quantity;
    SharedStorage.current_user_cart = this.CartData;
    // console.log(this.CartData);
    this.localStorage.setItem('CartItems', JSON.stringify(this.CartData));
  }
  onSendOrderPressed() {
    if (!SharedStorage.current_user_data) {
      this.showSignupConfirm();
    } else {
      const body = {
        CartData: this.CartData
      }
      let modelRef = this.modalService.show(ConfirmOrderComponent, { initialState: body, });
    }
  }
  onChangeQuantity(Data, value) {
    // console.log(Data);
    Data.quantity += value;
    this.UpdateCart();
  }
  showSignupConfirm() {
    this.snotify.confirm('يجب ان تكون مسجل لكي تتمكن من الوصول  الي هذه الصفحه', 'تسجيل الان', {
      timeout: 5000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      buttons: [
        {
          text: 'نعم اريد التسجيل', action: (toast) => {
            this.router.navigate(['/authentication']);
            this.snotify.remove(toast.id);
          }
        }
      ]
    });
  }

}
