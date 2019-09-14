import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketsRoutingModule } from './markets-routing.module';
import { ShowMarketsComponent } from './show-markets/show-markets.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';
import { MarketsDetailsComponent } from './markets-details/markets-details.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { MarketsComponent } from './markets.component';
import { PopoverModule } from 'ngx-bootstrap';
import { BreadcrumbsModule } from 'ng6-breadcrumbs';
import { MetaModule } from '@ngx-meta/core';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';

@NgModule({
  imports: [
    CommonModule,
    MarketsRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    SwiperModule,
    PopoverModule.forRoot(),
    MetaModule.forRoot(),
    // BreadcrumbsModule
    // BrowserAnimationsModule,s
    CollapseModule.forRoot(),
    NgxJsonLdModule
  ],
  declarations: [ShowMarketsComponent, MarketsDetailsComponent, MarketsComponent]
})
export class MarketsModule { }
