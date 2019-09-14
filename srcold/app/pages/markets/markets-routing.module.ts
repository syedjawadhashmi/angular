import { SellerGuardService } from "./../../core/shared/guard/seller-guard.service";

import { MarketsDetailsComponent } from "./markets-details/markets-details.component";
import { ShowMarketsComponent } from "./show-markets/show-markets.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "show",
    pathMatch: "full",
    data: { text: "عرض المتاجر" , texts: true  }
  },
  {
    path: "show",
    component: ShowMarketsComponent,
    data: { text: "عرض المتاجر", breadcrumbs: true  }
  },
  {
    path: "banner",
    loadChildren: "./banner/banner.module#BannerModule",
    canActivate: [SellerGuardService],
    data: { text: "الاعلانات" , breadcrumbs: true }
  },
  {
    path: "details/:id",
    component: MarketsDetailsComponent,
    data: { text: "عرض تفاصيل المتجر", breadcrumbs: true  }
  },
  {
    path: "details/:category_name/:id",
    component: MarketsDetailsComponent,
    data: { text: "عرض تفاصيل المتجر", breadcrumbs: true  }
  },
  {
    path: ":category_name",
    component: ShowMarketsComponent,
    data: { text: "عرض المتاجر" , breadcrumbs: true }
  },
  {
    path: ":country_name/:category_name",
    component: ShowMarketsComponent,
    data: { text: "عرض المتاجر", breadcrumbs: true  }

  },
  {
    path : ':country_name',
    component : ShowMarketsComponent,
    data: { text: "عرض المتاجر", breadcrumbs: true  }
  },
  {
    path : ':category_name',
    component : ShowMarketsComponent,
    data: { text: "عرض المتاجر", breadcrumbs: true  }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketsRoutingModule { }
