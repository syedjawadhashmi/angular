import { UserGuardService } from "./../../core/shared/guard/user-guard.service";
import { NotloginOrUserService } from "./../../core/shared/guard/notlogin-or-user.service";
import { SellerUserGuardService } from "./../../core/shared/guard/seller-user-guard.service";
import { UserComponent } from "./user.component";

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";

import { TimelineComponent } from "./timeline/timeline.component";
import { CartComponent } from "./cart/cart.component";
import { FavoriteComponent } from "./favorite/favorite.component";

const routes: Routes = [
  {
    path: "",
    component: UserComponent,
    children: [
      { path: "", redirectTo: "profile", pathMatch: "full" },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [SellerUserGuardService],
        data: { text: "الصفحه الشخصيه" , breadcrumbs: true }
      },
      {
        path: "cart",
        component: CartComponent,
        canActivate: [NotloginOrUserService],
        data: { text: "العربه" , breadcrumbs: true }
      },
      {
        path: "timeline",
        component: TimelineComponent,
        canActivate: [UserGuardService],
        data: { text: "متاجرك", breadcrumbs: true  }
      },
      {
        path: "favorite",
        component: FavoriteComponent,
        canActivate: [SellerUserGuardService],
        data: { text: "المفضله" , breadcrumbs: true }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
