import { SellerGuardService } from "./../../core/shared/guard/seller-guard.service";
import { ShowProductsComponent } from "./show-products/show-products.component";
import { ProductsComponent } from "./products.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MetaGuard } from "@ngx-meta/core";

const routes: Routes = [
  {
    path: "",
    component: ProductsComponent,
    children: [
      {
        path: "",
        redirectTo: "show",
        pathMatch: "full",
        data: { text: "عرض المنتجات", breadcrumbs: true  }
      },
      {
        path: "show",
        component: ShowProductsComponent,
        data: { text: "عرض المنتجات", breadcrumbs: true  }
      },
      {
        path: "myproducts",
        component: ShowProductsComponent,
        canActivate: [SellerGuardService],
        data: { text: "منتجاتي", breadcrumbs: true  }
      },
      // {
      //   path: "details/:market_name/:id",
      //   component: ProductDetailsComponent,
      //   data: { text: "عرض تفاصيل منتج" },
      //   resolve: {product : ProductDetailsResolveService},
      // },
      ,
      {
        path: ":category_name/:subcategory_name",
        component: ShowProductsComponent,
        data  : {text : 'عرض المنتجات', breadcrumbs: true }
      },
      {
        path: ":category_name",
        component: ShowProductsComponent,
        data  : {text : 'عرض المنتجات', breadcrumbs: true }
      },
      {
        path : "country/:country_name/:category_name",
        component : ShowProductsComponent,
        data  : {text : 'عرض المنتجات', breadcrumbs: true }
      },
      {
        path : "country/:country_name",
        component : ShowProductsComponent,
        data  : {text : 'عرض المنتجات', breadcrumbs: true }
      },
      // {
      //   path : "category/:category_name",
      //   component : ShowProductsComponent,
      //   data  : {text : 'عرض المنتجات', breadcrumbs: true }
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {}
