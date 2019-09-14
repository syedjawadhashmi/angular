import { SellerGuardService } from "./../../core/shared/guard/seller-guard.service";
import { CreateOfferComponent } from "./create-offer/create-offer.component";
import { ShowOffersComponent } from "./show-offers/show-offers.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "show", pathMatch: "full" },
  {
    path: "show",
    component: ShowOffersComponent,
    data: { text: "عرض العروض", breadcrumbs: true  }
  },
  {
    path: "create",
    component: CreateOfferComponent,
    canActivate: [SellerGuardService],
    data: { text: "اضافه عرض جديد", breadcrumbs: true  }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffersRoutingModule {}
