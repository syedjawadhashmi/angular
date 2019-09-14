import { sharedClass } from './../sharedattrubite';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: TransferHttpService) { }
  getOrders(offset, includeOwner, market_id, user_id) {
    const URL = `${sharedClass.BASE_URL}/order`;
    return this.http.post(URL, { offset: offset, market_id: market_id, user_id: user_id, include_owner: includeOwner });
  }
  createNewOrder(OrderData) {
    const URL = `${sharedClass.BASE_URL}/order/create`;
    return this.http.post(URL, OrderData);
  }
  changeOrderStatus(order_id, status) {
    const URL = `${sharedClass.BASE_URL}/order/status`;
    return this.http.post(URL, { status: status, order_id: order_id });
  }
  changeProductInOrderStatus(producId, orderId, status) {
    const URL = `${sharedClass.BASE_URL}/order/product/status`;
    return this.http.post(URL, { OrderId: orderId, ProductId: producId, status: status });
  }
}
