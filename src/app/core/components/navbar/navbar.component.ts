import { BroadcasterService } from 'ng-broadcaster';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit , Inject, PLATFORM_ID} from '@angular/core';
import { sharedClass } from '../../shared/sharedattrubite';
import { Router } from '@angular/router';

import { ProductsService } from '../../shared/services/products.service';
import { SnotifyService } from 'ng-snotify';
import { SharedStorage } from '../../shared/storageShared';
import { isPlatformBrowser } from '@angular/common';

declare var $;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  UserData;
  Subcategories = [] as any;
  categories = [] as any;

  math = Math;
  SearchingWord = '';
  Search_type = 'text';
  SearchingResult = {} as any;
  ImageBase = sharedClass.IMAGE_BASE_URL;
  sharedStorage = SharedStorage;
  CartCount = 0;
  _opened: boolean = true;
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private router: Router,
    private broadCaster: BroadcasterService,
    private proudctControlelr: ProductsService, private snotify: SnotifyService , @Inject(PLATFORM_ID) private platformId: Object) {
    // this.getAllSubcategories();

    if (localStorage.getItem('CartItems')) {
      SharedStorage.current_user_cart = JSON.parse(localStorage.getItem('CartItems'));
      this.CartCount = SharedStorage.current_user_cart.products.length;
      this.broadCaster.on('CartChanged').subscribe(data => {
        this.CartCount = SharedStorage.current_user_cart.products.length;
      }, err => {

      });
    }
  }

  ngOnInit() {
    this.getAllCategoreyWithsubcategory();
    // console.log('navbar intialized')


  }
  mouseHover(div_id) {
    document.getElementById(div_id).classList.add('open');
  }
  mouseLeave(div_id) {
    document.getElementById(div_id).classList.remove('open');
  }
  getAllCategoreyWithsubcategory() {
    this.proudctControlelr.getAllproductCategory(false, true, true, false , '').subscribe(data => {
      if (data['status'] === 'success') {
        // console.log(data);
        SharedStorage.product_categories = data['data'];
        this.categories = data['data']['rows'];
        SharedStorage.sidecatWithMarkets = this.categories;
        this.broadCaster.broadcast('SideDataUpdated');
        this.updateSubCategory();
      }
    }, err => {

    });
  }
  updateSubCategory() {
    this.Subcategories = [];
    for (const key in this.categories) {
      if (this.categories[key]) {
        for (let i = 0;i<this.categories[key]['subCategories'].length;i++){
          this.categories[key]['subCategories'][i]['category_name'] = this.categories[key].name;
          this.categories[key]['subCategories'][i]['category_id'] = this.categories[key].id;
          this.Subcategories.push(this.categories[key]['subCategories'][i]);
        }
        // this.Subcategories = this.Subcategories.concat(this.categories[key]['subCategories'][]);
      }
    }
    SharedStorage.sideSubcategories = this.Subcategories;
    this.broadCaster.broadcast('SideDataUpdated');
  }
  onGoToUserDetailsPage() {

  }
  onShowProductClicked() {
    if (SharedStorage.current_user_data && SharedStorage.current_user_data['category'] === 'seller') {
      if (!SharedStorage.current_user_data['Seller']['NumberOfMarkets']) {
        this.router.navigate(['/auth/seller-singup']);
        return;
      }
      this.router.navigate(['/products/create']);
    } else {
      this.router.navigate(['/auth/seller-login']);
    }
    let ele = document.getElementById('NgxAsidePanelRight') as any;
    if (ele) {
      ele.hide();
    }
  }
  onNavgigateToPage(pageComponent) {
    if ((pageComponent === 'favorite') && !this.UserData) {
      this.showSignupConfirm();
      return;
    }
    this.router.navigate(['/' + pageComponent]);
  }
  onMyOrdersClick() {
    if (!SharedStorage.current_user_data) {
      this.showSignupConfirm();
    } else {
      this.router.navigate(['/orders']);
    }
  }
  onGoToMarket(market) {
    SharedStorage.current_makret_data = market;
    this.router.navigate(['/market-details/' + market.id]);
  }
  onNavigateToOffers(offerType) {
    this.router.navigate(['/offers'], { queryParams: { offer_type: offerType } });
  }
  onLogOutClicked() {
    this.localStorage.clear();
    location.reload();
  }
  onInputChanged(event) {
    if (this.SearchingWord === '') {
      this.SearchingResult = {} as any;
      return;
    }
    this.proudctControlelr.searchProduct(this.SearchingWord, this.Search_type).subscribe(data => {
      if (data['status'] === 'success') {
        console.log(data['data']);
        this.SearchingResult = data['data'];
      } else {

      }
    }, err => {

    });
  }
  foucasChange() {
    setTimeout(() => {
      this.SearchingResult = {};
    }, 500);
  }
  onChangeSearchType(searchType) {
    this.Search_type = searchType;
  }
  showSignupConfirm() {
    this.snotify.confirm('يجب ان تكون مسجل لكي تتمكن من الوصول  الي هذه الصفحه', 'تسجيل الان', {
      timeout: 5000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      buttons: [
        {
          text: 'نعم اريد التسجيل', action: (toast) => {
            this.router.navigate(['/auth/user-login']);
            this.snotify.remove(toast.id);
          }
        }
      ]
    });
  }
  _toggleSidebar() {
    this.broadCaster.broadcast('toggleMenu');
  }
  closeMenu() {
    for (let i = 0; i < this.categories.length; i++) {
      document.getElementById(this.categories[i].id + 'cat').classList.remove('open');
    }
    document.getElementById('allSubCat').classList.remove('open');
  }
  slugName(nameString){
    let newName : string = nameString.replace(' ' , '-');
    return newName;
  }

}
