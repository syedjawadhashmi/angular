import { BroadcasterService } from './../../core/shared/services/broadcaster.service';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BreadcrumbsModule} from "ng6-breadcrumbs";

import { OffersRoutingModule } from './offers-routing.module';
import { CreateOfferComponent } from './create-offer/create-offer.component';
import { ShowOffersComponent } from './show-offers/show-offers.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OffersComponent } from './offers.component';
import { MetaModule } from '@ngx-meta/core';

@NgModule({
  imports: [
    CommonModule,
    OffersRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    MetaModule.forRoot()
    // BreadcrumbsModule
  ],
  providers : [BroadcasterService],

  declarations: [CreateOfferComponent, ShowOffersComponent, OffersComponent]
})
export class OffersModule { }
