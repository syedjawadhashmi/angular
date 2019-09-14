import { ProductsService } from "./../../../shared/services/products.service";
import { sharedClass } from "./../../../shared/sharedattrubite";
import { SharedStorage } from "./../../../shared/storageShared";
import { Component, OnInit, ViewChild } from "@angular/core";

import { BsModalRef } from "ngx-bootstrap/modal";
import { Router } from "@angular/router";
import { TabsetComponent } from "ngx-bootstrap/tabs";

@Component({
  selector: "app-alaunna-products",
  templateUrl: "./alaunna-products.component.html",
  styleUrls: ["./alaunna-products.component.css"]
})
export class AlaunnaProductsComponent implements OnInit {
  ProductsOffset = 0;
  AwshnProducts = [];

  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  IsLoading = false;

  MarketData = SharedStorage.current_user_data["markets"][0];
  SelectedProducts = [];

  ImageBase = sharedClass.IMAGE_BASE_URL;

  subcategory_id = false;
  subsubcategory_id = false;
  filterdsubCat;
  subsubcategories;
  fitlerdSubsubCat;
  @ViewChild("staticTabs") staticTabs: TabsetComponent;
  constructor(
    public productsController: ProductsService,
    public bsModalRef: BsModalRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.GetAwshnProducts();
    this.loadAllProductSubCategory();
    this.loadAllProductSubSubCategory();
  }
  GetAwshnProducts() {
    this.productsController
      .getAwshnProducts(
        this.ProductsOffset,
        this.MarketData["marketcategory_id"],
        this.subcategory_id,
        this.subsubcategory_id
      )
      .subscribe(
        data => {
          // console.log(data);
          if (data["status"] === "success") {
            this.AwshnProducts = data["data"];
          } else {
            alert(
              "هناك مشكله عند تحميل المنتجات برجاء اعاده المحاوله مره اخري عند التحقق من الاتصال بالانترنت"
            );
          }
        },
        err => {
          alert(
            "هناك مشكله عند تحميل المنتجات برجاء اعاده المحاوله مره اخري عند التحقق من الاتصال بالانترنت"
          );
        }
      );
  }
  onScroll() {
    if (!this.IsLoading) {
      this.ProductsOffset++;
      this.GetAwshnProducts();
    }
  }
  onInputCheckedChange() {
    this.SelectedProducts = [];
    for (const key in this.AwshnProducts) {
      if (this.AwshnProducts.hasOwnProperty(key)) {
        const element = this.AwshnProducts[key];
        if (element.checked) {
          element['market_product'] = {}; 
          this.SelectedProducts.push(element);
        }
      }
    }
  }
  onSaveClicked() {
    if (this.SelectedProducts.length === 0) {
      alert("برجاء اضافه منتجات من منتاجتنا لكي تتم العمليه بنجاح");
      return;
    }
    console.log(this.SelectedProducts);
    for (let key = 0; key < this.SelectedProducts.length; key++) {
      if (this.SelectedProducts.hasOwnProperty(key)) {
        const element = this.SelectedProducts[key];
        if (
          !element['market_product'].Selling_price ||
          !element['market_product'].Purchasing_price ||
          !element['market_product'].Tax ||
          !element['market_product'].quantity
        ) {
          alert("برجاء كتابه كل البيانات المطلوبه لكي تتم العمليه");
          return;
        }
        this.SelectedProducts[key]['market_product'].market_id = this.MarketData["id"];
        this.SelectedProducts[key]['owner'] = this.MarketData["id"];
        this.SelectedProducts[key]['main_owner'] = 'alaunna';
        this.SelectedProducts[key].id = undefined;
        console.log(this.SelectedProducts);
        if (key === this.SelectedProducts.length - 1) {
          this.productsController
            .createAwshnProduct({ products :  this.SelectedProducts})
            .subscribe(
              data => {
                console.log(data);
                if (data["status"] === "success") {
                  this.router.navigate(["/products/myproducts"], {queryParams : {market_id : this.MarketData['id'] , for_market : true}});
                  this.bsModalRef.hide();
                } else {
                  alert(
                    "من فضلك قم بكتابه كل البيانات المطلوبه لكي تتم عمليه الاضافه"
                  );
                }
              },
              err => {
                // console.log(err);
                alert(
                  "حدثت مشكله عند تنفيذ العمليه برجاء اعاده المحاوله بعد التحقق من الاتصال بالانترنت"
                );
              }
            );
        }
      }
    }
  }
  onSubCategoryChange() {
    // console.log('changes');
    this.fitlerdSubsubCat = this.subsubcategories.filter(x => {
      return x.subCategory_id === this.subcategory_id;
    });
    this.GetAwshnProducts();
  }
  loadAllProductSubCategory() {
    this.productsController.getAllProductSubCategory(false).subscribe(
      data => {
        if (data["status"] === "success") {
          this.filterdsubCat = data["data"]["rows"].filter(x => {
            return (
              x.productcategory_id === this.MarketData["marketcategory_id"]
            );
          });
          SharedStorage.product_subcategories = data["data"]["rows"];
        } else {
          alert("هناك مشكله برجاء التحقق من الاتصال بالانترنت واعاده الاتصال");
        }
      },
      err => {
        alert("هناك مشكله برجاء التحقق من الاتصال بالانترنت واعاده الاتصال");
      }
    );
  }
  loadAllProductSubSubCategory() {
    this.productsController.getAllProductSubSubCategory(false).subscribe(
      data => {
        if (data["status"] === "success") {
          this.subsubcategories = data["data"]["rows"];
          this.fitlerdSubsubCat = data["data"]["rows"];
          SharedStorage.product_subsubcategories = data["data"]["rows"];
        } else {
          alert("هناك مشكله برجاء التحقق من الاتصال بالانترنت واعاده الاتصال");
        }
      },
      err => {
        alert("هناك مشكله برجاء التحقق من الاتصال بالانترنت واعاده الاتصال");
      }
    );
  }

  onSubSubCategoryChanged() {
    this.GetAwshnProducts();
  }
}
