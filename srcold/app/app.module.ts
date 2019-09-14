import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { AddProductsExcelComponent } from "./core/components/modales/add-products-excel/add-products-excel.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

// module
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { TabsModule } from "ngx-bootstrap/tabs";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SidebarModule } from "ng-sidebar";
import { CollapseModule } from "ngx-bootstrap";

// third party lib
import { SnotifyModule, SnotifyService, ToastDefaults } from "ng-snotify";
import { NgxAsideModule } from "ngx-aside";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";
import { BroadcasterService } from "ng-broadcaster";
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { McBreadcrumbsModule } from 'ngx-breadcrumbs';

// components
import { AppComponent } from "./app.component";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatToolbarModule, MatExpansionModule } from '@angular/material';
import { FooterComponent } from "./core/components/footer/footer.component";
import { NavbarComponent } from "./core/components/navbar/navbar.component";
// import { MarketProductComponent } from "./core/components/modales/market-product/market-product.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
// import { SelectPtoductOptionsComponent } from "./core/components/modales/select-ptoduct-options/select-ptoduct-options.component";
// import { ImageViewComponent } from "./core/components/modales/image-view/image-view.component";
import { SidebarComponent } from "./core/components/sidebar/sidebar.component";
import { OneSignalService } from "./core/shared/services/OneSignalService";
import { BreadcrumbsModule } from "ng6-breadcrumbs";
import { ErrorComponent } from './core/components/error/error.component';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpModule, TransferHttpService } from '@gorniv/ngx-transfer-http';
import { FeedService } from './services/feed.service';
import { SpinnerComponent } from './spinner/spinner.component';
// import { ThumbnailPipe } from './pipes/thumbnail.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    // MarketProductComponent,
    // SelectPtoductOptionsComponent,
    // ImageViewComponent,
    ErrorComponent,
    SpinnerComponent,
    // ThumbnailPipe
  ],
  imports: [
    CommonModule,
    NgtUniversalModule,
    AppRoutingModule,
    SnotifyModule,
    NgxAsideModule,
    FormsModule,
    LoadingBarHttpClientModule,
    InfiniteScrollModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    BrowserAnimationsModule,
    SweetAlert2Module.forRoot(),
    BsDropdownModule.forRoot(),
    SidebarModule.forRoot(),
    CollapseModule.forRoot(),
    BreadcrumbsModule,
    HttpClientModule,
    TransferHttpModule,
    NgxJsonLdModule,
    McBreadcrumbsModule.forRoot(),
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MatToolbarModule,
    MatExpansionModule,
  ],
  providers: [
    { provide: "SnotifyToastConfig", useValue: ToastDefaults },
    SnotifyService,
    BroadcasterService,
    OneSignalService,
    TransferHttpService,
    FeedService
  ],
  entryComponents: [
    MarketProductComponent,
    SelectPtoductOptionsComponent,
    ImageViewComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
