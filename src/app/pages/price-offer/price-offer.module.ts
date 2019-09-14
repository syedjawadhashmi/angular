import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap';

import { PriceOfferRoutingModule } from './price-offer-routing.module';
import { CreatOfferComponent } from './creat-offer/creat-offer.component';
import { ShowOffersComponent } from './show-offers/show-offers.component';
import { ShowReplaysComponent } from './show-replays/show-replays.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreatOfferComponent, ShowOffersComponent, ShowReplaysComponent],
  imports: [
    CommonModule,
    PriceOfferRoutingModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PriceOfferModule { }
