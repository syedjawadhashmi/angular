import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import {NgModule} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpModule, TransferHttpService } from '@gorniv/ngx-transfer-http';

@NgModule({
 bootstrap: [AppComponent],

    imports:[
 BrowserModule.withServerTransition({appId: 'app-root'}),

 AppModule,

        ServerModule,
        NoopAnimationsModule,
        ModuleMapLoaderModule,
        ServerTransferStateModule, // comment
        HttpClientModule,
        TransferHttpModule,
    ],
    providers : [
      TransferHttpService
    ]
})
export class AppServerModule {}
