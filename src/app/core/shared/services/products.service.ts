import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { sharedClass } from '../sharedattrubite';
import { SharedStorage } from '../storageShared';
import swal from 'sweetalert2';
import { SnotifyService } from 'ng-snotify';
import { BsModalService } from 'ngx-bootstrap';

import { Router } from '@angular/router';
import { BroadcasterService } from 'ng-broadcaster';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  subscrib;
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any,
  private http: TransferHttpService,
    private snotify: SnotifyService,
    private modelRef: BsModalService,
    private brodcaster: BroadcasterService,
    private router: Router) { }

  // products
  getProducts(category_id, subcategory_id, subsubcategory_id, markte_id, status, offset , country_id) {
    // console.log(status);
    const URL = `${sharedClass.BASE_URL}/product`;
    return this.http.get(URL, {
      params: {
        category_id: category_id,
        subcategory_id: subcategory_id,
        subsubcategory_id: subsubcategory_id,
        market_id: markte_id,
        offset: offset,
        status: status,
        include_market: 'true',
        country_id : country_id
      }
    });
  }
  getMarketsProduct(offset, market_id) {
    const URL = `${sharedClass.BASE_URL}/product/market`;
    return this.http.post(URL, { offset: offset, market_id: market_id });
  }
  deleteProduct(product_id) {
    const URL = `${sharedClass.BASE_URL}/product/delete`;
    return this.http.post(URL, { product_id: product_id, delete_type: 'awshn_main' });
  }
  editProduct(productData) {
    const URL = `${sharedClass.BASE_URL}/product/edit`;
    return this.http.post(URL, productData);
  }
  createNewProduct(productData) {
    const URL = `${sharedClass.BASE_URL}/product/create`;
    return this.http.post(URL, productData);
  }
  searchProduct(searchword, search_type) {
    const URL = `${sharedClass.BASE_URL}/general/search?word=${searchword}&search_type=${search_type}`;
    return this.http.get(URL);
  }
  getProductData(product_id) {
    const URL = `${sharedClass.BASE_URL}/product/${product_id}`;
    return this.http.get(URL);
  }
  addProductsFromExcel(formData) {
    const headers = new HttpHeaders();
    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    const URL = `${sharedClass.BASE_URL}/product/create/market/excel`;
    return this.http.post(URL, formData, { headers: headers });
  }
  getAwshnProducts(offset, category_id, subcategory, subsubcategory) {
    const URL = `${sharedClass.BASE_URL}/product/awshn?offset=${offset}&category_id=${category_id}&subcategory_id=${subcategory}&subsubcategory_id=${subsubcategory}`;
    return this.http.get(URL);
  }
  readMultiableProducts(productsData) {
    const URL = `${sharedClass.BASE_URL}/product/create/multiple`;
    return this.http.post(URL, { products: productsData });
  }

  getMainImageIndex(images) {
    let minindex = 0;
    let minid = 999999;
    for (let i = 0; i < images.length; i++) {
      if (images[i].id < minid){
        minid = images[i].id;
        minindex = i;
      }
    }
    return minindex;
  }
 

  onAddToCart(ProductData, NavigateToCart, quantity) {
    if (SharedStorage.current_user_data && SharedStorage.current_user_data['category'] == 'seller') {
      swal('خطأ', 'لا يمكنك اضافه اي شي للعربه اذا كنت تاجر, وحدهم المستخدمين العادين القادرين علي ذالك ', 'error');
      return;
    }

    if (ProductData['market'][0]['Market_Products']['quantity'] == 0 || ProductData['market'][0]['Market_Products']['quantity'] < quantity) {
      this.snotify.error('لا يوجد كميه كافيه في هذا المنتج');
      return;
    }

    for (let i = 0; i < SharedStorage.current_user_cart.products.length; i++) {
      if (ProductData['id'] == SharedStorage.current_user_cart.products[i]['product_id']) {
        if (SharedStorage.current_user_cart.products[i]['quantity'] + quantity > ProductData['market'][0]['Market_Products']['quantity']) {
          this.snotify.error('لا يوجد كميه كافيه في هذا المنتج');
          return;
        }
        SharedStorage.current_user_cart.products[i]['quantity'] += quantity;
        this.snotify.success('تم تعديل كميه العنصر في السله بنجاح');
        //this.snotify.warning('هذا المنتج موجود بالفعل في عربه التسوق');
        return;
      }
    }
    let price = ProductData['market'][0].Market_Products['Selling_price'];
    let offer = ProductData['offer'];
    let final_price = 1 * price;
    if (offer) {
      if (offer['offer_type'] == 1 || offer['offer_type'] == 4 || offer['offer_type'] == 5) {
        price = price - (price * (offer['value'] / 100));
        final_price = 1 * price;
      }
    }

    SharedStorage.currentOfferData = false;
    SharedStorage.current_user_cart.total_price += final_price;
    SharedStorage.current_user_cart.total_items++;
    SharedStorage.current_user_cart.total_quantity += 1;
    if (ProductData.extraInput && ProductData.extraInput != "[]") {

      this.subscrib = this.modelRef.onHidden.subscribe(data => {
        if (!SharedStorage.curent_option) {
          swal('خطأ', 'برجاء اختيار الطلبات المخصصه لافاضه المنتج الي عربه التسوق');
          return;
        }
        SharedStorage.current_user_cart.products.push({ product_id: ProductData.id, market_id: ProductData['owner'], quantity: quantity, extra_options: JSON.stringify(SharedStorage.curent_option) });
        ProductData['extraInput'] = SharedStorage.curent_option;
        SharedStorage.current_user_cart.productsData.push(ProductData);
        //SharedStorage.current_user_cart.market_id = ProductData['owner'];
        //SharedStorage.current_user_cart.marketData = ProductData['market'][0];
        this.localStorage.setItem('CartItems', JSON.stringify(SharedStorage.current_user_cart));
        this.brodcaster.broadcast('CartChanged');
        this.snotify.success('تم اضافه العنصر الي السله بنجاح');
        this.subscrib.unsubscribe();
        SharedStorage.curent_option = undefined;
        if (NavigateToCart) {
          this.router.navigate(["/user/cart"]);
        }
      })
    } else {
      SharedStorage.current_user_cart.products.push({ product_id: ProductData.id, quantity: 1, market_id: ProductData['owner'], extra_options: "[]" });
      SharedStorage.current_user_cart.productsData.push(ProductData);
      //SharedStorage.current_user_cart.market_id = ProductData['owner'];
      //SharedStorage.current_user_cart.marketData = ProductData['market'][0];
      this.localStorage.setItem('CartItems', JSON.stringify(SharedStorage.current_user_cart));
      this.brodcaster.broadcast('CartChanged');
      if (NavigateToCart) {
        this.router.navigate(["/user/cart"]);
      }
      this.snotify.success('تم اضافه العنصر الي السله بنجاح');
    }

  }

  // product favorite
  getAllFavorite(user_id, offset) {
    const URL = `${sharedClass.BASE_URL}/product/favorite?user_id=${user_id}&offset=${offset}`;
    return this.http.get(URL);
  }
  addProductToFavorite(user_id, product_id) {
    const URL = `${sharedClass.BASE_URL}/product/favorite/create`;
    return this.http.post(URL, { user_id: user_id, product_id: product_id });
  }
  deletefavorite(id) {
    const URL = `${sharedClass.BASE_URL}/product/favorite/remove`;
    return this.http.post(URL, { id: id });
  }

  // product category
  getAllproductCategory(offset, includeSubcategories, inceludeMarkets, includeProducts, specialMarket) {
    let URL;
    if (offset !== false || offset === 0) {
      // tslint:disable-next-line:max-line-length
      URL = `${sharedClass.BASE_URL}/product/category?offset=${offset}&incoudeSubcategories=${includeSubcategories}&includeProducts=${includeProducts}&includeMarkets=${inceludeMarkets}&special=${specialMarket}`;
    } else {
      // tslint:disable-next-line:max-line-length
      URL = `${sharedClass.BASE_URL}/product/category?incoudeSubcategories=${includeSubcategories}&includeProducts=${includeProducts}&includeMarkets=${inceludeMarkets}&special=${specialMarket}`;
    }
    return this.http.get(URL);
  }
  getCAtegoryById(id) {
    const URL = `${sharedClass.BASE_URL}/product/category/${id}`;
    return this.http.get(URL);
  }
  createNewProductCategory(CategoryData) {
    const URL = `${sharedClass.BASE_URL}/product/category/create`;
    return this.http.post(URL, CategoryData);
  }

  // product sub sub category
  getAllProductSubCategory(offset) {
    let URL;
    if (offset !== false || offset === 0) {
      URL = `${sharedClass.BASE_URL}/product/subcategory?offset=${offset}`;
    } else {
      URL = `${sharedClass.BASE_URL}/product/subcategory`;
    }
    return this.http.get(URL);
  }
  createNewProductSubCategory(SubCategoryData) {
    const URL = `${sharedClass.BASE_URL}/product/subcategory/create`;
    return this.http.post(URL, SubCategoryData);
  }

  // product sub sub category
  getAllProductSubSubCategory(offset) {
    let URL;
    if (offset !== false || offset === 0) {
      URL = `${sharedClass.BASE_URL}/product/subsubcategory?offset=${offset}`;
    } else {
      URL = `${sharedClass.BASE_URL}/product/subsubcategory`;
    }
    return this.http.get(URL);
  }
  createNewProductSubSubCategory(SubSubCategoryData) {
    const URL = `${sharedClass.BASE_URL}/product/subsubcategory/create`;
    return this.http.post(URL, SubSubCategoryData);
  }

  // product rate
  createNewrate(RateData) {
    const URL = `${sharedClass.BASE_URL}/product/rate/create`;
    return this.http.post(URL, RateData);
  }
  getallRates(product_id, user_id, include_user, offset) {
    // tslint:disable-next-line:max-line-length
    const URL = `${sharedClass.BASE_URL}/product/rate?offset=${offset}&user_id=${user_id}&product_id=${product_id}&include_user=${include_user}`;
    return this.http.get(URL);
  }
  removeRate(rate_id) {
    const URL = `${sharedClass.BASE_URL}/product/rate/remove`;
    return this.http.post(URL, { id: rate_id });
  }
  editRate(RateData) {
    const URL = `${sharedClass.BASE_URL}/product/rate/edit`;
    return this.http.post(URL, RateData);
  }

  // product offers
  getAllProductsOffer(offset, date, product_id) {
    const URL = `${sharedClass.BASE_URL}/product/offer?`;
    return this.http.post(URL, { offset: offset, date: date, product_id: product_id });
  }
  getAllProductOffersUnGrouped(offset, date, offer_type) {
    const URL = `${sharedClass.BASE_URL}/product/offer/ungrouped`;
    return this.http.post(URL, { offset: offset, date: date, offer_type: offer_type , status : 'active' });
  }
  getSubCategoryWithProduct(market_id) {
    const URL = `${sharedClass.BASE_URL}/product/subcategory_product?market_id=${market_id}`;
    return this.http.get(URL);
  }
  createOfferWithproducts(OfferData) {
    const URL = `${sharedClass.BASE_URL}/product/offer/create/multiable`;
    return this.http.post(URL, OfferData);
  }
  getAllOffersReleatedToUser(user_id, offset) {
    let URL = `${sharedClass.BASE_URL}/favorite/filter`;
    return this.http.post(URL, { user_id: user_id, offset: offset });
  }

  createAwshnProduct(productData){
    let URL =`${sharedClass.BASE_URL}/product/awshn`;
    return this.http.post(URL , productData);
  }
}
