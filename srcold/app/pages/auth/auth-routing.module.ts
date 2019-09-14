import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthComponent } from './auth.component';
import { SellerSignupComponent } from './seller-signup/seller-signup.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SellerLoginComponent } from './seller-login/seller-login.component';

const routes: Routes = [{
  path: '',
  component: AuthComponent,
  children: [
    { path: '', redirectTo: 'user-login', pathMatch: 'full', data: { text: 'تسجيل الدخول',    breadcrumbs: true }  },
    { path: 'user-signup', component: LoginComponent, data: { type: 'singup', text: 'تسجيل جديد',breadcrumbs: true } },
    { path: 'user-login', component: LoginComponent, data: { type: 'login', text: 'تسجيل الدخول',breadcrumbs: true } },
    { path: 'seller-signup', component: SellerSignupComponent, data: { text: 'تسجيل جديد كتاجر',breadcrumbs: true } },
    { path: 'add-market', component: SellerSignupComponent, data: { text: 'اضافه متجر',breadcrumbs: true } },
    { path: 'seller-login', component: SellerLoginComponent, data: { text: 'تسجيل دخول كتاجر',breadcrumbs: true } },
    { path: 'reset-password', component: ForgotPasswordComponent, data: { text: 'اعاده تعين كلمه المرور' , breadcrumbs: true } }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
