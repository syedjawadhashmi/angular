import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewHomeRoutingModule } from './new-home-routing.module';
import { NewHomeComponent } from './new-home.component';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { MetaModule } from '@ngx-meta/core';
@NgModule({
  declarations: [NewHomeComponent ],
  imports: [
    CommonModule,
    NewHomeRoutingModule,
    FormsModule,
    PopoverModule.forRoot(),
    SwiperModule,
    MetaModule.forRoot(),
  ]
})
export class NewHomeModule { }
