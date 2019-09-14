import { SellerGuardService } from './../../../core/shared/guard/seller-guard.service';
import { CreateBannerComponent } from './create-banner/create-banner.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'create', pathMatch: 'full', data: { breadcrumb: 'اضافه اعلان جديد' } },
  { path: 'create', component: CreateBannerComponent, canActivate: [SellerGuardService] ,data: { breadcrumb: 'اضافه اعلان جديد' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerRoutingModule { }
