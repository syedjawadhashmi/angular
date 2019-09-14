import { ProductsService } from './../../shared/services/products.service';
import { Component, OnInit, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { BroadcasterService } from 'ng-broadcaster';
import { SharedStorage } from '../../shared/storageShared';
import { sharedClass } from '../../shared/sharedattrubite';
import { EventEmitter } from '@angular/core';


declare var $: any;
@Component({
  // moduleId: module.id,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  public menuItems = [];
  CONSOLE = console;
  Subcategories;
  categories;

  @Input() UserData;

  @Output()
  closeNow = new EventEmitter();

  ImageBase = sharedClass.IMAGE_BASE_URL;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private proudctControlelr: ProductsService, public broadCaster: BroadcasterService) {

  }

  ngOnInit() {
    // $.getScript('./assets/js/app-sidebar.js');
    //console.log(this.menuItems);
    //this.menuItems = ROUTES;
    //this.getfilterdCategories();
    this.Subcategories = SharedStorage.sideSubcategories;
    this.categories = SharedStorage.sidecatWithMarkets;
    this.getAllCategoreyWithsubcategory();
  }
  onItemClicked(item) {
    if (item.collabse) {
      item.collabse = false
    } else {
      item.collabse = true;
    }
  }
  getfilterdCategories() {
    // this.categoryController.getfilterdCategories().subscribe(data => {
    //   console.log(data);
    //   if (data['status'] == 'success'){
    //     this.menuItems = data['data'];
    //   } else {
    //   }
    // } ,err => {})
  }
  buildMenu() {
    this.menuItems.push({name : 'الصفحه الرئيسيه' , path : '/' , type : 'offer' ,  params : {}})
    // this.menuItems.push({ name: 'ألاأونا بتختارلك', type: 'offer', path: '/offers', params: { offer_type: 5 } });
    // this.menuItems.push({ name: 'أحدث الموديلات', type: 'offer', path: '/offers', params: { offer_type: 1 } });
    // // this.menuItems.push({ name: 'عرض قطعه وقطعه', type: 'offer', path: '/offers', params: { offer_type: 2 } });
    // // this.menuItems.push({ name: 'عرض قطعه', type: 'offer', path: '/offers', params: { offer_type: 3 } });
    // this.menuItems.push({ name: ' المنتجات المفضلة للزائرين', type: 'offer', path: '/offers', pa rams: { offer_type: 4 } });
    this.menuItems.push({name : 'متاجرك' , path : '/user/timeline' , type : 'offer',  params : {} } );
    this.menuItems.push({name : 'منتجاتك المفضله' , path : '/user/favorite' , type : 'offer' ,  params : {} } );
    this.menuItems.push({name : 'سله الشراء' , path : '/user/cart' , type : 'offer' ,  params : {} } );
    this.menuItems.push({name : 'المنتجات' , path : '/products' , type : 'offer' ,  params : {} } );
    this.menuItems.push({name: 'جميع الفئات', type: 'cat', subitems: this.Subcategories, collapse: true });
    this.menuItems.push({name : 'اعرض متجرك عندنا' , path : '/auth/seller-signup' , type : 'offer' ,  params : {} } );
    this.menuItems.push({name : 'تسجيل دخول التاجر' , path : '/auth/seller-login' , type : 'offer' ,  params : {} } );
    // for (let i = 0; i < this.categories.length; i++) {
    //   this.menuItems.push({ name: 'متجر ' + this.categories[i].name, type: 'offer', path: '/markets', params: { category_id: this.categories[i].id } });
    // }
  }
  getAllCategoreyWithsubcategory() {
    this.proudctControlelr.getAllproductCategory(false, true, true, false, '').subscribe(data => {
      if (data['status'] === 'success') {
        console.log(data);
        SharedStorage.product_categories = data['data'];
        this.categories = data['data']['rows'];
        SharedStorage.sidecatWithMarkets = this.categories;
        this.updateSubCategory();
      }
    }, err => {

    });
  }
  updateSubCategory() {
    this.Subcategories = [];
    for (const key in this.categories) {
      if (this.categories[key]) {
        this.Subcategories = this.Subcategories.concat(this.categories[key]['subCategories']);
      }
    }
    this.buildMenu();
  }
  closeSidebar(){
    this.closeNow.emit('emitNow');
  }

}
