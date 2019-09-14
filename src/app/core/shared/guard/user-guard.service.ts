import swal from 'sweetalert2';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { SharedStorage } from '../storageShared';
@Injectable({
  providedIn: 'root'
})
export class UserGuardService implements CanActivate {
  constructor(private router: Router) { }
  canActivate() {
    if (SharedStorage.current_user_data && SharedStorage.current_user_data['category'] == 'customer') {
      return true;
    }
    this.router.navigate(['/auth/user/login']);
    swal({
      title: 'خطأ',
      type: 'warning',
      confirmButtonText: 'تسجيل الدخول',
      cancelButtonText: 'تسجيل جديد',
      showCancelButton: false,
      showConfirmButton: false,
      html: `
      <p> يجب عليك تسجيل الدخول كمستخدم لكي تستطيع الوصول لهذه الصفحه </p>
      ` ,
    })
    return false;
  }
}
