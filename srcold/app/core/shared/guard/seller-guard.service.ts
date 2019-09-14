import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SharedStorage } from '../storageShared';
import swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class SellerGuardService implements CanActivate {

  constructor(private router: Router) { }
  canActivate() {
    if (SharedStorage.current_user_data && SharedStorage.current_user_data['category'] == 'seller') {
      if (!SharedStorage.current_user_data['markets'] || !SharedStorage.current_user_data['markets'][0]) {
        this.router.navigate(['/auth/add-market']);
        swal('خطأ', 'يجب عليك اضافه متجر لكي تتمكن من الوصول لهذه الصفحه', 'error');
        return;
      }
      if (SharedStorage.current_user_data['markets'][0]['status'] != 'active') {
        this.router.navigate(['/home']);
        swal('خطأ', 'المتجر الخاص بك لم يتم الموافقه عليه حتي الان برجاء برجاء الانتظار حتي يتم الموافقه', 'error');
        return false;
      }
      return true;
    }
    this.router.navigate(['/home']);
    swal({
      title: 'خطأ',
      type: 'warning',
      showCancelButton: false,
      showConfirmButton: false,
      html: `
      <p> يجب عليك تسجيل الدخول كتاجر لكي تستطيع الوصول لهذه الصفحه </p>
      ` ,
    })
    return false;
  }
}
