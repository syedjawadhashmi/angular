import { SharedStorage } from './../../../shared/storageShared';
import { BroadcasterService } from 'ng-broadcaster';
import { OrdersService } from './../../../shared/services/orders.service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import swal from 'sweetalert2';
import { Component, OnInit , Inject} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})
export class ConfirmOrderComponent implements OnInit {

  CartData = {} as any;

  OrderData = {} as any;
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, public bsModalRef: BsModalRef,
    private OrderController: OrdersService,
    private BroadCaster: BroadcasterService,
    private router: Router) { }

  ngOnInit() {
    // console.log(this.CartData);
  }
  onSaveClicked() {
    this.OrderData['total_price'] = this.CartData['total_price'];
    this.OrderData['total_items'] = this.CartData['total_items'];
    this.OrderData['products'] = this.CartData['products'];
    this.OrderData['user_id'] = SharedStorage.current_user_data['id'];
    this.OrderData['market_id'] = this.CartData['market_id'];
    this.OrderData['sutiable_place'] ='مكان المتجر'
    this.OrderController.createNewOrder(this.OrderData).subscribe(data => {
      if (data['status'] == 'success') {
        this.bsModalRef.hide();
        this.localStorage.removeItem('CartItems');
        SharedStorage.current_user_cart = { total_price: 0, total_quantity: 0, total_items: 0, sutiable_place: '', sutiable_time: '', products: [], productsData: [], market_id: -1, marketData: {} };
        this.BroadCaster.broadcast('CartChanged');
        this.router.navigate(['/orders']);
        swal('تم اضافه الطلب', 'سوف يتم التواصل معك بواسطه المتجر', 'success');

      } else {
        swal('خطأ', 'برجاء اضافه العنوان المناسب ليتم اكتمل الطلب', 'error');
      }
    }, err => {
      swal('خطأ', 'هناك مشكله عند اضافه الطلب برجاء اعاده المحاوله واذا تككررت المشكله برجاء قم بتقديم شكوي', 'error');
    })
  }

}
