import { BroadcasterService } from "ng-broadcaster";
import { ProductsService } from "./../../../core/shared/services/products.service";
import { MarketsService } from "./../../../core/shared/services/markets.service";
import { SharedStorage } from "./../../../core/shared/storageShared";
import { sharedClass } from "./../../../core/shared/sharedattrubite";
import { SeoService } from "./../../../core/shared/services/seo.service";
import { BsModalService } from "ngx-bootstrap/modal";
// import { SelectPtoductOptionsComponent } from "./../../../core/components/modales/select-ptoduct-options/select-ptoduct-options.component";
import { Component, OnInit, OnDestroy } from "@angular/core";

import { SwiperConfigInterface } from "ngx-swiper-wrapper";
import { Router, ActivatedRoute } from "@angular/router";

import { SnotifyService } from "ng-snotify";
import swal from "sweetalert2";
import { Title } from "@angular/platform-browser";
import { MetaService } from "@ngx-meta/core";
import { ThrowStmt } from "@angular/compiler";

@Component({
  selector: "app-markets-details",
  templateUrl: "./markets-details.component.html",
  styleUrls: ["./markets-details.component.css"]
})
export class MarketsDetailsComponent implements OnInit {
  isCollapsed = true;
  offset = 0;
  MarketData = {} as any;
  // MarketProducts = [] as any;

  SubCategoriesWithProducts = [] as any;

  Banners = [] as any;
  ImageBase = sharedClass.IMAGE_BASE_URL;
  math = Math;
  ProductStatus = {
    pending: "بأنتظار الحجز",
    active: "فعال",
    not_active: "غير فعال"
  };
  products = [];
  filteredProducts = [];
  UserData = SharedStorage.current_user_data;
  IsLoading = false;
  showMore = false;
  Swiperindex = 0;
  schema;
  days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  Swiperconfig: SwiperConfigInterface = {
    direction: "horizontal",
    allowSlideNext: true,
    allowSlidePrev: true,
    spaceBetween: 30,
    // loop: true,
    navigation: true,
    pagination: true,
    autoplay: true,
    // autoHeight: true,
    height: 200,
    observer: true,
    breakpoints: {
      767: {
        height: 200
      }
    }
  };
  subscrib;
  constructor(
    private marketController: MarketsService,
    private router: Router,
    public productsService: ProductsService,
    private route: ActivatedRoute,
    private snotify: SnotifyService,
    private brodcaster: BroadcasterService,
    private modelRef: BsModalService,
    private seoService: SeoService,
    private titleServes: Title,
    private meta: MetaService
  ) {
    this.seoService.createLinkForCanonicalURL();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params["id"]) {
        let id = params["id"];
        if (id.indexOf("_") == -1) {
          id = id.split("_")[0];
        }
        this.marketController.getMarketById(id).subscribe(
          data => {
            // console.log(data);
            if (data["status"] === "success") {
              if (data["data"]) {
                this.MarketData = data["data"];
                console.log(this.MarketData);
                this.MarketData["oppning_hours"] = JSON.parse(
                  this.MarketData["oppning_hours"]
                );
                this.setMetaTag();
                // this.loadAllMarketsProduct();
                this.getProducts("active");
                this.titleServes.setTitle(this.MarketData.name);
                this.getMarketsBanner();
                this.intializeSchema();
              } else {
                swal("خطأ", "هذا المتجر غير متوفر الان", "error");
                this.router.navigate(["/home"]);
              }
            }
          },
          err => {}
        );
      }
    });
  }
  setMetaTag() {
    this.meta.setTag("author", "alaunna");
    this.meta.setTag("description", this.MarketData.meta_description);
    this.meta.setTag("keywords", this.MarketData.meta_keywords);
    this.meta.setTag("og:title", this.MarketData.name);
    this.meta.setTag("og:type", "website");
    this.meta.setTag("og:description", this.MarketData.meta_description);
    this.meta.setTag(
      "og:image",
      this.ImageBase +
        "/" +
        this.MarketData["Image"].for +
        "/" +
        this.MarketData["Image"].name
    );
    this.meta.setTag(
      "og:url",
      "https://alaunna.com/markets/details/" +
        this.MarketData.id +
        "-" +
        this.MarketData.name
    );
    this.meta.setTag("og:image:width", "220");
    this.meta.setTag("og:image:height", "220");
    this.meta.setTag("og:type", "product");
    this.meta.setTag("og:author", "alaunna");
    this.meta.setTag("og:site_name", "alaunna");

    this.meta.setTag("twitter:title", this.MarketData["name"]);
    this.meta.setTag("twitter:description", this.MarketData.meta_description);
    this.meta.setTag(
      "twitter:image",
      this.ImageBase +
        "/" +
        this.MarketData["Image"].for +
        "/" +
        this.MarketData["Image"].name
    );
    this.meta.setTag("twitter:site", "alaunna");
    this.meta.setTag("twitter:creator", "alaunna");
  }
  loadAllMarketsProduct() {
    this.productsService
      .getSubCategoryWithProduct(this.MarketData["id"])
      .subscribe(
        data => {
          // console.log(data);
          if (data["status"] == "success") {
            this.SubCategoriesWithProducts = data["data"];
          }
        },
        err => {}
      );
  }
  onProductDetailsClciked(product) {
    SharedStorage.current_product_data = product;
    this.router.navigate([
      "/products/details/" +
        product.category.name +
        "/" +
        product.subCategory.name +
        "/" +
        product.id +
        "_" +
        product.name
    ]);
  }
  onLoadMoreClicked() {
    this.offset++;
    this.loadAllMarketsProduct();
  }
  getMarketsBanner() {
    this.marketController
      .loadAllMarketsBanners(this.MarketData["id"], "active", "")
      .subscribe(
        data => {
          // console.log(data);
          if (data["status"] == "success") {
            this.Banners = data["data"]["rows"];
          }
        },
        err => {}
      );
  }
  onFollowMarketClicked() {
    if (!SharedStorage.current_user_data) {
      this.showSignupConfirm();
      return;
    }
    this.marketController
      .addMarketToFavorite(
        this.MarketData.id,
        SharedStorage.current_user_data.id
      )
      .subscribe(
        data => {
          if (data["status"] == "success") {
            this.snotify.success("تم اضافه المتجر الي قائمه التتبع");
          } else {
            if (data["error"]["action"] == "already-exist") {
              this.snotify.warning("هذا المتجر موجود في قائه التتبع الخاصه بك");
            } else {
              this.snotify.error(
                "حدثت مشكله عند اضافه المتجر الي قائمه التتبع برجاء المحاوله في وقت لاحق"
              );
            }
          }
        },
        err => {
          this.snotify.error(
            "حدثت مشكله عند اضافه المتجر الي قائمه التتبع برجاء المحاوله في وقت لاحق"
          );
        }
      );
  }
  showSignupConfirm() {
    this.snotify.confirm(
      "يجب ان تكون مسجل لكي تتمكن من الوصول  الي هذه الصفحه",
      "تسجيل الان",
      {
        timeout: 5000,
        showProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        buttons: [
          {
            text: "نعم اريد التسجيل",
            action: toast => {
              this.router.navigate(["/auth/user-login"]);
              this.snotify.remove(toast.id);
            }
          }
        ]
      }
    );
  }
  onAddToFavoritePressed(ProductData) {
    if (
      !SharedStorage.current_user_data ||
      !SharedStorage.current_user_data["id"]
    ) {
      swal(
        "خطأ",
        "يجب ان تكون مسجل حتي تسطتيع اضافه هذا المنتج الي المفضله",
        "warning"
      );
      return;
    }
    this.productsService
      .addProductToFavorite(SharedStorage.current_user_data.id, ProductData.id)
      .subscribe(
        data => {
          if (data["status"] == "success") {
            SharedStorage.current_user_data["favorites"].push({
              id: data["data"]["id"],
              product_id: ProductData["id"]
            });
            this.snotify.success("تم اضافه المنتج بنجاح الي المفضله");
          } else {
            if (data["error"]["action"] == "exists-before") {
              this.snotify.warning("هذا المنتج موجود بالفعل في المفضله");
            }
          }
        },
        err => {
          this.snotify.warning(
            "حدثت مشكله عند اضافه المنتج الي المفضله برجاء التحقق من الاتصال بالانترنت واعاده المحاوله"
          );
        }
      );
  }

  onScroll() {
    // console.log('get product');
    if (!this.IsLoading) {
      this.offset++;
      if (this.route.url["value"][0].path == "myproducts") {
        this.getProducts("all");
      } else {
        this.getProducts("active");
      }
    }
  }
  getProducts(status) {
    this.IsLoading = true;
    this.productsService
      .getProducts("", "", "", this.MarketData.id, status, this.offset, "")
      .subscribe(
        data => {
          console.log(data);
          this.IsLoading = false;
          if (data["status"] == "success") {
            if (this.offset == 0) {
              this.products = data["data"]["rows"];
              this.filteredProducts = data["data"]["rows"];
            } else {
              this.products = this.products.concat(data["data"]["rows"]);
              this.filteredProducts = this.filteredProducts.concat(
                data["data"]["rows"]
              );
              if (data["data"]["rows"].length == 0) {
                this.showMore = false;
              }
              // this.onSortChanged(this.SortBy);
              // this.onFilterWithPriceClicked();
            }
          } else {
            this.snotify.error(
              "حدثت مشكله عند تحضير المنتجات برجاء التحقق من الاتصال بالانترنت واعاده المحاوله"
            );
          }
        },
        err => {
          this.snotify.error(
            "حدثت مشكله عند تحضير المنتجات برجاء التحقق من الاتصال بالانترنت واعاده المحاوله"
          );
        }
      );
  }
  intializeSchema() {
    let marketImages = [];
    marketImages.push(
      this.ImageBase +
        "/" +
        this.MarketData["Image"].for +
        "/" +
        this.MarketData["Image"].name
    );
    marketImages.push(
      this.ImageBase +
        "/" +
        this.MarketData["cover"].for +
        "/" +
        this.MarketData["cover"].name
    );
    this.schema = {
      "@context": "https://schema.org/",
      "@type": "market",
      name: this.MarketData["name"],
      image: marketImages,
      description: this.MarketData["description"],
      sku: "0446310786",
      mpn: "925872",
      url: "https://alaunna.com/markets/details/" + this.MarketData.id,
      telephone: this.MarketData.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: this.MarketData.address
      },
      openingHoursSpecification: [],
      geo: {
        "@type": "GeoCoordinates",
        latitude: this.MarketData.lat,
        longitude: this.MarketData.lng
      },
      brand: {
        "@type": "market",
        name: this.MarketData.name
      },
      sameAs: [
        this.MarketData.facebook,
        this.MarketData.twitter,
        this.MarketData.linkedin,
        this.MarketData.instagram
      ]
    };

    for (let i = 0; i < this.days.length; i++) {
      if (
        this.MarketData["oppning_hours"] &&
        this.MarketData["oppning_hours"][this.days[i]]
      ) {
        this.schema["openingHoursSpecification"].push({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "http://schema.org/" + this.days[i],
          closes: this.MarketData["oppning_hours"][this.days[i]].to,
          opens: this.MarketData["oppning_hours"][this.days[i]].from
        });
      }
    }
  }
}
