import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
// module
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BreadcrumbsModule} from "ng6-breadcrumbs";
import { MetaModule } from '@ngx-meta/core';

import { ProductsRoutingModule } from './products-routing.module';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

import { RatingModule } from "ngx-bootstrap/rating";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SwiperModule } from "ngx-swiper-wrapper";
//components
import { AddProductsExcelComponent } from './../../core/components/modales/add-products-excel/add-products-excel.component';
import { AlaunnaProductsComponent } from './../../core/components/modales/alaunna-products/alaunna-products.component';
import { ProductsComponent } from './products.component';
import { ShowProductsComponent } from './show-products/show-products.component';
import { ShareModule } from '@ngx-share/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';

@NgModule({
  imports: [
    CommonModule,
    ProductsRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    ModalModule.forRoot(),
    RatingModule,
    FontAwesomeModule,
    TabsModule,
    ShareModule.forRoot(),
    // BsDatepickerModule.forRoot(),
    SwiperModule,
    MetaModule.forRoot(),
    PopoverModule.forRoot(),
    NgxJsonLdModule,
  ],
  entryComponents: [AlaunnaProductsComponent, AddProductsExcelComponent ],
  declarations: [
    ProductsComponent,
    ShowProductsComponent,
    AlaunnaProductsComponent,
    AddProductsExcelComponent,
  ]
})
export class ProductsModule { }
