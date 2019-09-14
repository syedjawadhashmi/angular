import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import {BreadcrumbsModule} from "ng6-breadcrumbs";
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SwiperModule } from "ngx-swiper-wrapper";
import { MetaModule } from '@ngx-meta/core';
@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SwiperModule,
    // BreadcrumbsModule,
    MetaModule.forRoot()
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
