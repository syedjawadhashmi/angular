import swal from 'sweetalert2';
import { SharedStorage } from './../storageShared';

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class NotloginOrUserService implements CanActivate {

  constructor() { }
  canActivate() {
    if (!SharedStorage.current_user_data || (SharedStorage.current_user_data && SharedStorage.current_user_data['category'] == 'customer')) {
      return true;
    }
    swal({
      title: 'خطأ',
      type: 'warning',
      confirmButtonText: 'تسجيل الدخول',
      cancelButtonText: 'تسجيل جديد',
      showCancelButton: false,
      showConfirmButton: false,
      html: `
      <p> لا يمكنك الوصول الي هذه الصفحه يجب ان تكون مستخدم عادي وليس تاجر </p>
      ` ,
    })
    return false;
  }
}
