import { SharedStorage } from './../../../shared/storageShared';
import { ProductsService } from './../../../shared/services/products.service';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-products-excel',
  templateUrl: './add-products-excel.component.html',
  styleUrls: ['./add-products-excel.component.css']
})
export class AddProductsExcelComponent implements OnInit {


  formData: FormData = new FormData();
  file;

  MarketData = {} as any;
  constructor(public bsModalRef: BsModalRef,
    private productsController: ProductsService, private router: Router) {

  }

  ngOnInit() {
    this.MarketData = SharedStorage.current_user_data['markets'][0];
  }
  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.file = file;

      this.formData.append('market_id', this.MarketData['id']);
      this.formData.append('market_category', this.MarketData['marketcategory_id']);
      this.formData.append('uploadFile', file, file.name);
    } else {
      this.file = undefined;
    }
  }
  onAddButtonClicked() {
    if (!this.file) {
      alert('برجاء اختيار ملف ليتم رفعه');
      return;
    }
    this.productsController.addProductsFromExcel(this.formData).subscribe(data => {
      if (data['status'] === 'success') {
        alert('تم اضافه المنتجات بنجاح');
        // this.router.navigate(['/markets']);
        this.bsModalRef.hide();
        this.router.navigate(['/home']);
      } else {
        alert('برجاء اضافه ملف صالح');
      }
    }, err => {
      alert('حدث مشكله عند رفع الملف برجاء التحقق من الاتصال بالانترنت');
    });
  }
}
