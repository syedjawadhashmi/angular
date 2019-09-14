import { sharedClass } from "./../../../core/shared/sharedattrubite";
import { BroadcasterService } from "ng-broadcaster";
import { MarketsService } from "./../../../core/shared/services/markets.service";
import { ProductsService } from "./../../../core/shared/services/products.service";
import { WINDOW } from "@ng-toolkit/universal";
import { SeoService } from "./../../../core/shared/services/seo.service";
// import { SelectPtoductOptionsComponent } from "./../../../core/components/modales/select-ptoduct-options/select-ptoduct-options.component";
import { BsModalService } from "ngx-bootstrap/modal";
import { SharedStorage } from "./../../../core/shared/storageShared";
import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { SnotifyService } from "ng-snotify";
import { SwiperConfigInterface } from "ngx-swiper-wrapper";
import swal from "sweetalert2";
// import { LocationService } from "../../../core/shared/services/location.service";
import { Title } from "@angular/platform-browser";
import { HelperToolsService } from './../../../core/shared/services/helper-tools.service';
import { MetaService } from "@ngx-meta/core";
import { CodegenComponentFactoryResolver } from "@angular/core/src/linker/component_factory_resolver";

@Component({
  selector: "app-show-products",
  templateUrl: "./show-products.component.html",
  styleUrls: ["./show-products.component.css"]
})
export class ShowProductsComponent implements OnInit {
  ProductStatus = {
    pending: "بأنتظار الحجز",
    active: "فعال",
    not_active: "غير فعال"
  };
  offset = 0;
  markets = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}] as any;
  products = [] as any;
  filteredProducts = [] as any;
  market_id;
  category_id;
  subcategory_id;
  subsubcategory_id;
  PriceFrom;
  PriceTo;
  SortBy;
  ImageBase = sharedClass.IMAGE_BASE_URL;
  math = Math;
  UserData = SharedStorage.current_user_data;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  forMarket = false;
  IsLoading = false;
  showMore = true;
  country_id = "";
  offersType = {
    1: "أحدث الموديلات",
    //  2: 'عروض قطعه وقطعه',
    //   3: 'عروض قطعه وقطعتين',
    4: "المنتجات المفضلة للزائرين",
    5: "ألاأونا بتختارلك"
  };
  filterInpputs = [];
  ShowFilter = false;
  Swiperconfig: SwiperConfigInterface;
  Swiperindex = 0;
  finalFilterdInputs = {};
  subscrib;
  settingData;
  userData = {} as any;
  AllCountry = [];
  sharedStorage = SharedStorage;
  constructor(
    @Inject(WINDOW) private window: Window,
    private broadCaster: BroadcasterService,
    private route: ActivatedRoute,
    public productsController: ProductsService,
    private marketController: MarketsService,
    private router: Router,
    private snotify: SnotifyService,
    private brodcaster: BroadcasterService,
    private modelRef: BsModalService,
    private seoService: SeoService,
    // private locationController: LocationService,
    private title: Title , 
    private helperTools : HelperToolsService , 
    private meta : MetaService
  ) {
    this.seoService.createLinkForCanonicalURL();
    this.getAllMarkets();
    this.loadAllCountry();
  }
  async ngOnInit() {
    //this.buildingInputs();

    this.settingData = await this.helperTools.getSetting();

    this.meta.setTag('description', this.settingData.products_meta_description);
    this.meta.setTag('og:description', this.settingData.products_meta_description);
    this.meta.setTag('keywords', this.settingData.products_meta_keyword);

    

    this.route.queryParams.subscribe(params => {
      this.market_id = params["market_id"];
      this.category_id = params["category_id"];
      this.subcategory_id = params["subcategory_id"];
      this.subsubcategory_id = params["subsubcategory_id"];
      this.forMarket = params["for_market"];
      this.route.params.subscribe(data => {
        if (data["category_name"]) {
          this.category_id = data["category_name"].split("-")[0];
          console.log(data['category_name']);
          this.title.setTitle(
            "الاأونا - عرض منتجات " + data["category_name"].split("-")[1]
          );
        }
        if (data["subcategory_name"]) {
          this.subcategory_id = data["subcategory_name"].split("-")[0];
          this.title.setTitle(
            " الاأونا - عرض منتجات " + data["subcategory_name"]
          );
          console.log(this.subcategory_id);
        }
        if (data['country_name']){
          this.country_id = data['country_name'].split('-')[0];
        }
        this.offset = 0;
        if (this.route.url["value"][0].path == "myproducts") {
          this.getProducts("all");
        } else {
          this.getProducts("active");
        }
      });
      this.offset = 0;
      if (this.route.url["value"][0].path == "myproducts") {
        this.getProducts("all");
      } else {
        this.getProducts("active");
      }
    });
  }
  _toggleSidebar() {
    this.broadCaster.broadcast('toggleMenu');
  }
  loadAllCountry() {
    if (this.locationController.Countries) {
      this.AllCountry = this.locationController.Countries;
      return;
    }
    this.locationController.getAllCountry(false).subscribe(
      data => {
        if (data["status"] === "success") {
          this.AllCountry = data["data"]["rows"];
          this.locationController.Countries = data["data"]["rows"];
        }
      },
      err => {}
    );
  }
  buildingInputs() {
    if (!SharedStorage.product_categories) {
      return;
    }
    for (let i = 0; i < SharedStorage.product_categories["rows"].length; i++) {
      if (
        (this.category_id &&
          SharedStorage.product_categories["rows"][i].id == this.category_id) ||
        !this.category_id
      ) {
        this.filterInpputs = this.filterInpputs.concat(
          JSON.parse(SharedStorage.product_categories["rows"][i]["inputs"])
        );
      }
      for (
        let j = 0;
        j < SharedStorage.product_categories["rows"][i].subCategories.length;
        j++
      ) {
        if (
          (this.subcategory_id &&
            SharedStorage.product_categories["rows"][i].subCategories[j].id ==
              this.subcategory_id) ||
          !this.subcategory_id
        ) {
          this.filterInpputs = this.filterInpputs.concat(
            JSON.parse(
              SharedStorage.product_categories["rows"][i].subCategories[j]
                .inputs
            )
          );
        }
      }
    }
  }
  getProducts(status) {
    this.IsLoading = true;
    this.productsController
      .getProducts(
        this.category_id,
        this.subcategory_id,
        this.subsubcategory_id,
        this.market_id,
        status,
        this.offset,
        this.country_id
      )
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
              this.onSortChanged(this.SortBy);
              this.onFilterWithPriceClicked();
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
  getAllMarkets() {
    this.marketController
      .getAllmarkets(false, "name,id", false, false, false, "active")
      .subscribe(
        data => {
          // console.log(data);
          if (data["status"] == "success") {
            this.markets = data["data"]["rows"];
            this.Swiperconfig = {
              direction: "horizontal",
              allowSlideNext: true,
              allowSlidePrev: true,
              //spaceBetween: 30,
              loop: false,
              navigation: true,
              slidesPerView: 9,
              // pagination: {
              //   el: '.swiper-pagination',
              //   clickable: true,
              // },
              //autoplay: true,
              //autoHeight: true,
              // height: 350,
              // slidePrevClass : 'prev-class',
              // slideNextClass : 'next-class',
              breakpoints: {
                // when window width is <= 320px
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10
                },
                // when window width is <= 480px
                480: {
                  slidesPerView: 2,
                  spaceBetween: 20
                },
                // when window width is <= 640px
                640: {
                  slidesPerView: 3,
                  spaceBetween: 30
                },
                1000: {
                  slidesPerView: 5,
                  spaceBetween: 30
                },
                10000: {
                  slidesPerView: 9,
                  spaceBetween: 30
                }
              }
            };
          }
        },
        err => {}
      );
  }
  onMarketClick(market_id) {
    this.market_id = market_id;
    this.getProducts("active");
  }
  onSortChanged(Type) {
    this.SortBy = Type;
    if (this.SortBy == "new") {
      this.filteredProducts.sort((a, b) => {
        return a.id < b.id ? -1 : 1;
      });
    } else if (this.SortBy == "low") {
      this.filteredProducts.sort((a, b) => {
        return a.market[0].Market_Products["Selling_price"] >
          b.market[0].Market_Products["Selling_price"]
          ? 1
          : -1;
      });
    } else if (this.SortBy == "high") {
      this.filteredProducts.sort((a, b) => {
        return a.market[0].Market_Products["Selling_price"] <
          b.market[0].Market_Products["Selling_price"]
          ? 1
          : -1;
      });
    }
    // console.log(this.filteredProducts);
  }
  onFilterWithPriceClicked() {
    if (!this.PriceFrom || !this.PriceTo) {
      return;
    }
    this.filteredProducts = this.products.filter(a => {
      return (
        a.market[0].Market_Products["Selling_price"] >= this.PriceFrom &&
        this.PriceTo >= a.market[0].Market_Products["Selling_price"]
      );
    });
  }
  onMarketDetailsClicked(market) {
    SharedStorage.current_makret_data = market;
    this.router.navigate(["/markets/details/" + market.id + "_" + market.name]);
  }
  onProductDetailsClciked(product) {
    this.router.navigate([
      "/products/details/" +
        product.category.name +
        "/" +
        product.subCategory.name
        + '/'+
        product.id +
        "_" +
        product.name
    ]);
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

  // finalInputbuilding(){
  //   for(let i = 0;i<this.filterInpputs.length;i++){
  //     let justInput = [];
  //     for (let j = 0 ;j<this.filterInpputs[i].values.length;j++){
  //       if (this.filterInpputs[i].values[j].checked){
  //         justInput.push(values)
  //       }
  //     }
  //   }
  // }
  onValueChanged(subitm, i, j, vlaue) {
    // console.log(vlaue);
    if (!vlaue) {
      this.finalFilterdInputs[i].splice(j, 1);
      this.updateproductsWitlFilters();
      return;
    }
    if (!this.finalFilterdInputs[i]) {
      this.finalFilterdInputs[i] = [];
    }
    if (!this.finalFilterdInputs[i][j]) {
      this.finalFilterdInputs[i].push(subitm);
    }
    //// console.log(this.finalFilterdInputs);
    this.updateproductsWitlFilters();
  }
  updateproductsWitlFilters() {
    let inputsFilterdProduct = this.products.filter(x => {
      return true;
    });
    //// console.log(inputsFilterdProduct);
    // console.log(this.finalFilterdInputs);
    // for (let i = 0; i < this.finalFilterdInputs.length; i++) {
    //   inputsFilterdProduct = inputsFilterdProduct.filter(x => {
    //     let productExtraInput = JSON.parse(x.extraInput);

    //   })
    // }
    for (let k in this.finalFilterdInputs) {
      if (this.finalFilterdInputs[k].length == 0) {
        // console.log('canceld');
        this.filteredProducts = inputsFilterdProduct;
        continue;
      }
      inputsFilterdProduct = inputsFilterdProduct.filter(x => {
        let productExtraInput = JSON.parse(x.extraInput);
        let checkInputs = productExtraInput.filter(xinput => {
          // // console.log(xinput);
          // // console.log(this.filterInpputs[k].name );
          if (this.filterInpputs[k].name == xinput.name) {
            if (this.finalFilterdInputs[k].length == 0) {
              return true;
            }
            if (xinput.value && xinput.value.constructor === Array) {
              return xinput.value.every(val =>
                this.finalFilterdInputs[k].includes(val)
              );
            } else if (xinput.value) {
              return this.finalFilterdInputs[k].includes(xinput.value);
            }
          }
        });
        //// console.log(checkInputs);
        if (checkInputs.length != 0) {
          return true;
        } else {
          return false;
        }
      });
      //// console.log(inputsFilterdProduct);
      this.filteredProducts = inputsFilterdProduct;
    }
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
    this.productsController
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
  onCountryChange() {
    if (this.route.url["value"][0].path == "myproducts") {
      this.getProducts("all");
    } else {
      this.getProducts("active");
    }
  }
}
