import { ErrorComponent } from "./core/components/error/error.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SellerUserGuardService } from "./core/shared/guard/seller-user-guard.service";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        // redirectTo: "home",
        loadChildren: "./pages/new-home/new-home.module#NewHomeModule",
        // pathMatch: "full",
        data: { breadcrumb: "الرئيسيه" }
      },
      {
        path: "home",
        // loadChildren: "./pages/home/home.module#HomeModule",
        redirectTo: "",
        pathMatch: "full",
        data: { breadcrumb: "الرئيسيه" }
      },
      {
        path: "products",
        loadChildren: "./pages/products/products.module#ProductsModule",
        data: { breadcrumb: "المنتجات" }
      },
      {
        path: "offers",
        loadChildren: "./pages/offers/offers.module#OffersModule",
        data: { breadcrumb: "العروض" }
      },
      {
        path: "markets",
        loadChildren: "./pages/markets/markets.module#MarketsModule",
        data: { breadcrumb: "المتاجر" }
      },
      {
        path: "auth",
        loadChildren: "./pages/auth/auth.module#AuthModule",
        data: { breadcrumb: "التسجيل" }
      },
      {
        path: "user",
        loadChildren: "./pages/user/user.module#UserModule",
        data: { breadcrumb: "المستخدم" }
      },
      {
        path: "orders",
        loadChildren: "./pages/orders/orders.module#OrdersModule",
        data: { breadcrumb: "الطالبات" }
      },
      {
        path: "price-offer",
        loadChildren: "./pages/price-offer/price-offer.module#PriceOfferModule"
      }
      // {    path: '**', redirectTo: '/404' },
      // { path: '404', component: ErrorComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
