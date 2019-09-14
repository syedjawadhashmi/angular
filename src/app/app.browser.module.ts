import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpModule, TransferHttpService } from '@gorniv/ngx-transfer-http';

@NgModule({
  bootstrap: [AppComponent],

  imports: [
    BrowserModule.withServerTransition({ appId: 'app-root' }),

    AppModule,
    HttpClientModule,
    TransferHttpModule,
    BrowserTransferStateModule
  ],
  providers: [
    TransferHttpService
  ]
})
export class AppBrowserModule { }
