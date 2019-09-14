import { ProductsService } from './../../../core/shared/services/products.service';
import { Title } from '@angular/platform-browser';
import { SharedStorage } from './../../../core/shared/storageShared';
import { OrdersService } from './../../../core/shared/services/orders.service';
import { sharedClass } from './../../../core/shared/sharedattrubite';
import { WINDOW } from '@ng-toolkit/universal';
import { SeoService } from './../../../core/shared/services/seo.service';
import { UserComponent } from './../../user/user.component';
import { Component, OnInit , Inject} from '@angular/core';

import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import swal from 'sweetalert2';

@Component({
  selector: 'app-show-orders',
  templateUrl: './show-orders.component.html',
  styleUrls: ['./show-orders.component.css']
})
export class ShowOrdersComponent implements OnInit {

  orders;
  CurrentUserData = {} as any;
  offset = 0;

  market_id = false;
  ImageBase = sharedClass.IMAGE_BASE_URL;
  user_id = false;
  OrderStatus = { 'pending': 'في الحجز', 'accepted': 'يتم تجهيزه', 'canceld': 'تم الغاءه ', 'with_captian': 'في الطريق اليك' };
  constructor(@Inject(WINDOW) private window: Window,
  private orderController: OrdersService,
    private router: Router,
    private snotify: SnotifyService ,
    private seoService : SeoService , private title : Title , public productController : ProductsService ) {
      this.title.setTitle('الااونا - عرض الطالبات')
      this.seoService.createLinkForCanonicalURL();

  }

  ngOnInit() {
    if (SharedStorage.current_user_data) {
      this.CurrentUserData = SharedStorage.current_user_data;
      if (this.CurrentUserData.category == 'seller') {
        // console.log(this.CurrentUserData);
        this.market_id = this.CurrentUserData['markets'][0]['id'];
      } else {
        this.user_id = this.CurrentUserData.id;
      }
      this.getUserOrders();
    } else {
      this.router.navigate(['/home']);
    }
  }
  getUserOrders() {
    // console.log(this.market_id);
    this.orderController.getOrders(this.offset, false, this.market_id, this.user_id).subscribe(data => {
      // console.log(data);
      if (data['status'] === 'success') {
        this.orders = data['data']['rows'];
      }
    }, err => {

    });
  }
  // onLoadMoreClicked(){
  //   this.offset++;
  //   this.getUserOrders();
  // }
  onPrintPressed(order) {
    // const printContent = document.getElementById(order.id);
    // const WindowPrt = this.window.print();
    // WindowPrt.close();
    // this.printDiv(order.id);
  }
  onScroll() {
    if (this.orders && this.orders.length >= 10) {
      this.offset++;
      this.getUserOrders();
    }
  }
  onChangeOrderStatus(order, status) {
    this.orderController.changeOrderStatus(order.id, status).subscribe(data => {
      if (data['status'] === 'success') {
        this.offset = 0;
        this.getUserOrders();
        this.snotify.success('تم تغير حاله الطلب بنجاح');
      }
    }, err => {

    });
  }
  // printDiv(divName) {

  //   const printContents = document.getElementById(divName).innerHTML;
  //   const originalContents = document.body.innerHTML;
  //   if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
  //     const popupWin = window.open('', '_blank',
  //     'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
  //     popupWin.window.focus();
  //     popupWin.document.write('<!DOCTYPE html><html><head>' +
  //       '<link rel="stylesheet" type="text/css" href="../../../styles.css" />' +
  //       '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
  //     popupWin.onbeforeunload = function (event) {
  //       popupWin.close();
  //       return '.\n';
  //     };
  //     popupWin.onabort = function (event) {
  //       popupWin.document.close();
  //       popupWin.close();
  //     };
  //   } else {
  //     const popupWin = window.open('', '_blank', 'width=800,height=600');
  //     popupWin.document.open();
  //     popupWin.document.write('<html><head><link rel="stylesheet"
  //      type="text/css" href="../../../styles.css" /></head><body onload="window.print()">' + printContents + '</html>');
  //     popupWin.document.close();
  //   }
  //   popupWin.document.close();

  //   return true;
  // }
  getExtraInputAsJSON(extraInput) {
    return JSON.parse(extraInput)
  }
  onChangeProductInOrderStatus(order, product_id, status) {
    // // if (order.status != 'accepted') {
    // //   swal('خطأ', 'برجاء قبول الطلب حتي يتم تغير حالات الممنتجات', 'warning');
    // //   return;
    // // }
    // // console.log(order.id);
    // // console.log(product_id);
    this.orderController.changeProductInOrderStatus(product_id, order.id, status).subscribe(data => {
      if (data['status'] == 'success') {
        this.snotify.success('تم تغير الحاله بنجاح');
        this.offset = 0;
        this.orders = [];
        this.getUserOrders();
      } else {
        this.snotify.error('برجاء كتابه رقم المنتج ورقم الطلب لكي يتم تغير الحاله الخاصه بهم');
      }
    }, err => {
      this.snotify.error('برجاء كتابه رقم المنتج ورقم الطلب لكي يتم تغير الحاله الخاصه بهم');
    })
  }
}
