import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BreadcrumbsModule} from "ng6-breadcrumbs";

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "angular-6-social-login";

import { AuthRoutingModule } from './auth-routing.module';
import { SellerSignupComponent } from './seller-signup/seller-signup.component';
import { LoginComponent } from './login/login.component';
import { SellerLoginComponent } from './seller-login/seller-login.component';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

// Configs
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("243489299852457")
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("495611751503-7i3ft2stpeh8gkoucvs4b4f2s9eog17t.apps.googleusercontent.com")
      }
    ]
  );
  return config;
}


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    SocialLoginModule,
    // BreadcrumbsModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  declarations: [SellerSignupComponent, LoginComponent, SellerLoginComponent, AuthComponent, ForgotPasswordComponent]
})
export class AuthModule { }
