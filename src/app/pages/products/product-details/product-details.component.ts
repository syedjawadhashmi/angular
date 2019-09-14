import { ProductsService } from "./../../../core/shared/services/products.service";
import { SharedStorage } from "./../../../core/shared/storageShared";
import { BannerService } from "./../../../core/shared/services/banner.service";
import { sharedClass } from "./../../../core/shared/sharedattrubite";
import { WINDOW } from "@ng-toolkit/universal";
import { Component, OnInit, Inject } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { SnotifyService } from "ng-snotify";
import { ShareButtons } from "@ngx-share/core";
import { MetaService } from "@ngx-meta/core";
import swal from "sweetalert2";
import {  Title } from "@angular/platform-browser";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"]
})
export class ProductDetailsComponent implements OnInit {
  products = [] as any;
  offset = false;

  ProductData = {} as any;
  ImageBase = sharedClass.IMAGE_BASE_URL;

  math = Math;
  Inputs;
  Quantity = 0;

  SelectedImageIndex = 0;
  ads = [] as any;
  subscrib;
  ProductInFavList = false;
  offersType = {
    1: "أحدث الموديلات",
    // 2: 'عروض قطعه وقطعه',
    // 3: 'عروض قطعه وقطعتين',
    4: "المنتجات المفضلة للزائرين",
    5: "ألاأونا بتختارلك"
  };
  subScription;
  UserData = SharedStorage.current_user_data;
  schema ;
  // private readonly meta: MetaService;
  constructor(
    @Inject(WINDOW) private window: Window,
    public productsController: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private bannerService: BannerService,
    private modalService: BsModalService,
    private snotify: SnotifyService,
    public share: ShareButtons,
    private readonly meta: MetaService,
    private title: Title
  ) {
    // this.seoService.createLinkForCanonicalURL();
  }
  ngOnInit() {
    //this.initSlide();
    // this.route.params.subscribe(params => {
    //   if (params['id']) {
    //     let id = params['id'];
    //     if (id.indexOf('_')) {
    //       id = params['id'].split('_')[0];
    //     }
    //     console.log(id);
    //     // console.log(id);
    //     this.productsController.getProductData(id).subscribe(data => {
    //       console.log(data);
    //       if (data['status'] == 'success') {
    //         if (data['data'].status != 'active' &&
    //           (!this.UserData || (this.UserData['category'] == 'seller' && this.UserData['markets'][0]['id'] != data['data'].owner) || this.UserData['category'] != 'seller')) {
    //           swal('خطأ', 'هذا المنتج غير متوفر الان', 'error');
    //           this.router.navigate(['home']);
    //           return;
    //         }

    //         this.ProductData = data['data'];
    //         this.title.setTitle(this.ProductData.name);
    //         this.assignMetaTags();
    //         if (this.ProductData.extraInput) {
    //           this.Inputs = JSON.parse(this.ProductData.extraInput);
    //           // console.log(this.Inputs)
    //         }
    //         this.getReleatedProducts();
    //         this.checkIfThisProductInFavoriteList();
    //         this.checkIfProductExistInCart();
    //       }
    //     }, err => {

    //     })
    //   } else {
    //     swal('خطأ', 'برجاء كتابه رقم المنتج', 'error');
    //   }
    // })
    this.route.data.subscribe(data => {
      if (
        data["product"].status != "active" &&
        (!this.UserData ||
          (this.UserData["category"] == "seller" &&
            this.UserData["markets"][0]["id"] != data["product"].owner) ||
          this.UserData["category"] != "seller")
      ) {
        swal("خطأ", "هذا المنتج غير متوفر الان", "error");
        this.router.navigate(["home"]);
        return;
      }
      this.ProductData = data["product"];

      this.title.setTitle(this.ProductData.name);
      this.assignMetaTags();
      if (this.ProductData.extraInput) {
        this.Inputs = JSON.parse(this.ProductData.extraInput);
        // console.log(this.Inputs)
      }
      this.getReleatedProducts();
      this.checkIfThisProductInFavoriteList();
      this.checkIfProductExistInCart();
      this.intializeSchema();
    });
    this.getBannersForProductproduct();
  }
  assignMetaTags() {
    this.meta.setTag("author", "alaunna");
    this.meta.setTag("description", this.ProductData.meta_description);
    this.meta.setTag("keywords", this.ProductData.meta_keywords);
    this.meta.setTag("og:title", this.ProductData.name);
    this.meta.setTag("og:type", "website");
    this.meta.setTag("og:description", this.ProductData.meta_description);
    this.meta.setTag(
      "og:image",
      this.ImageBase +
        "/" +
        this.ProductData["images"][0].for +
        "/" +
        this.ProductData["images"][0].name
    );
    this.meta.setTag(
      "og:url",
      "https://alaunna.com/products/details/" + this.ProductData.category.name  + '/' + this.ProductData.subCategory.name + '/' + this.ProductData.id +  '-' + this.ProductData.name
    );
    this.meta.setTag('og:image:width' , "700");
    this.meta.setTag('og:image:height' , "700");
    this.meta.setTag('og:type' , 'product');
    this.meta.setTag('og:author' , 'alaunna');
    this.meta.setTag("og:site_name", "alaunna");

    this.meta.setTag("twitter:title", this.ProductData["name"]);
    this.meta.setTag("twitter:description", this.ProductData.meta_description);
    this.meta.setTag(
      "twitter:image",
      this.ImageBase +
        "/" +
        this.ProductData["images"][0].for +
        "/" +
        this.ProductData["images"][0].name
    );
    this.meta.setTag("twitter:site", "alaunna");
    this.meta.setTag("twitter:creator", "alaunna");
  }
  checkIfProductExistInCart() {
    for (let i = 0; i < SharedStorage.current_user_cart.products.length; i++) {
      if (
        this.ProductData["id"] ==
        SharedStorage.current_user_cart.products[i]["product_id"]
      ) {
        this.Quantity = SharedStorage.current_user_cart.products[i]["quantity"];
        //this.snotify.warning('هذا المنتج موجود بالفعل في عربه التسوق');
        return;
      }
    }
  }
  checkIfThisProductInFavoriteList() {
    // console.log(SharedStorage.current_user_data);
    if (SharedStorage.current_user_data) {
      let favList = SharedStorage.current_user_data.favorites;
      for (let i = 0; i < favList.length; i++) {
        if (this.ProductData["id"] == favList[i]["product_id"]) {
          this.ProductInFavList = true;
          break;
        }
      }
    }
  }
  getReleatedProducts() {
    // console.log(this.ProductData);
    this.productsController
      .getProducts(
        "",
        false,
        false,
        this.ProductData["market"][0]["id"],
        "active",
        0,
        ""
      )
      .subscribe(
        data => {
          // console.log(data);
          if (data["status"] == "success") {
            this.products = data["data"]["rows"].slice(0, 8);
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
  onMarketDetailsClicked(market) {
    SharedStorage.current_makret_data = market;
    this.router.navigate(["/markets/details/" + market.id + "_" + market.name]);
  }
  onProductDetailsClciked(product) {
    SharedStorage.current_product_data = product;
    // this.ProductData = product;
    this.router
      .navigate(["/products/details/" + this.ProductData.category.name + '/' + this.ProductData.subCategory.name + '/'  +product.id + "_" + product.name])
      .then(__ => {
        location.reload();
      });
  }
  onBuyNowClicked() {
    if (!SharedStorage.current_user_data) {
      if (confirm("انت غير مسجل لدينا . يمكنك تسجيل الدخول الأن")) {
        this.router.navigate(["/auth/user-signup"]);
      }
    } else {
      this.productsController.onAddToCart(
        this.ProductData,
        true,
        this.Quantity
      );
    }
  }
  getBannersForProductproduct() {
    this.bannerService.getAllBanners("website", "product-details").subscribe(
      data => {
        //// console.log(data);
        this.ads = data["data"]["rows"];
      },
      err => {}
    );
  }
  onAddProductToFavorite() {
    if (this.ProductInFavList) {
      return;
    }
    if (SharedStorage.current_user_data) {
      this.productsController
        .addProductToFavorite(
          SharedStorage.current_user_data.id,
          this.ProductData.id
        )
        .subscribe(
          data => {
            if (data["status"] == "success") {
              SharedStorage.current_user_data["favorites"].push({
                id: data["data"]["id"],
                product_id: this.ProductData["id"]
              });
              this.ProductInFavList = true;
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
    } else {
      this.snotify.warning("يجب ان تكون مسجل لكي تتمكن من الدخول لهذه الصفحه");
      this.router.navigate(["/auth/user-signup"]);
    }
  }
  onAdClick(ad) {
    this.window.open(ad.link);
  }
  onRateProductclicked() {
    if (!SharedStorage.current_user_data) {
      this.snotify.warning("يجب ان تكون مسجل لكي تتمكن من الدخول لهذه الصفحه");
      return;
    }

    const body = {
      ProductData: this.ProductData
    };
    // let modelRef = this.modalService.show(RateProductComponent, {
    //   initialState: body
    // });
  }
  onShowProductRating() {
    const body = {
      ProductData: this.ProductData
    };
    // let modelRef = this.modalService.show(ProductRatingDataComponent, {
    //   initialState: body
    // });
  }
  onChangeQuantity(value) {
    this.Quantity += value;
    if (this.Quantity <= 0) {
      this.Quantity = 0;
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
  onImageView() {
    const body = {
      currentIndex: this.SelectedImageIndex,
      Images: this.ProductData.images
    };
    // let modelRef = this.modalService.show(ImageViewComponent, {
    //   initialState: body,
    //   class: "ImageViewClass"
    // });
  }
  intializeSchema (){
    console.log(this.ProductData)
    let productImages=[];
    for (let i = 0;i<this.ProductData['images'];i++){
      productImages.push(this.ImageBase + '/' + this.ProductData['images'][i].for + '/' + this.ProductData['images'].name);
    }
    this.schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": this.ProductData['name'],
      "image": this.ImageBase + "/" + this.ProductData['images'][0].for + "/big/" + this.ProductData['images'][0].name,
      "description": this.ProductData['description'],
      "sku": "0446310786",
      "mpn": "925872",
      "brand": {
        "@type": "Thing",
        "name": this.ProductData['market'][0].name
      },
    }
  }
}
