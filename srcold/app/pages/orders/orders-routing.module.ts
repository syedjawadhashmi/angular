import { SellerUserGuardService } from "./../../core/shared/guard/seller-user-guard.service";

import { ShowOrdersComponent } from "./show-orders/show-orders.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "show",
    pathMatch: "full",
    data: { text: "عرض الطلبات", breadcrumbs: true  }
  },
  {
    path: "show",
    component: ShowOrdersComponent,
    canActivate: [SellerUserGuardService],
    data: { text: "عرض الطالبات", breadcrumbs: true  }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule {}
