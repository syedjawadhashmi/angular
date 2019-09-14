import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { ShowOrdersComponent } from './show-orders/show-orders.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OrdersComponent } from './orders.component';

@NgModule({
  imports: [
    CommonModule,
    OrdersRoutingModule,
    InfiniteScrollModule
  ],
  declarations: [ShowOrdersComponent, OrdersComponent]
})
export class OrdersModule { }
