import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerRoutingModule } from './banner-routing.module';
import { CreateBannerComponent } from './create-banner/create-banner.component';

@NgModule({
  imports: [
    CommonModule,
    BannerRoutingModule,
    FormsModule,

  ],
  declarations: [CreateBannerComponent]
})
export class BannerModule { }
