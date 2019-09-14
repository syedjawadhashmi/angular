import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { ConfirmOrderComponent } from './../../core/components/modales/confirm-order/confirm-order.component';
import {BreadcrumbsModule} from "ng6-breadcrumbs";

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { FavoriteComponent } from './favorite/favorite.component';
import { CartComponent } from './cart/cart.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ProfileComponent } from './profile/profile.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RatingModule } from "ngx-bootstrap/rating";
import { UserComponent } from './user.component';
import { BroadcasterService } from "ng-broadcaster";

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    InfiniteScrollModule,
    RatingModule,
    ModalModule.forRoot(),

  ],
  providers : [BroadcasterService],
  entryComponents: [ConfirmOrderComponent],
  declarations: [TimelineComponent, ProfileComponent, CartComponent, FavoriteComponent, ConfirmOrderComponent, UserComponent]
})
export class UserModule { }
