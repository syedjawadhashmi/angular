
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { SharedStorage } from '../storageShared';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SellerUserGuardService  implements CanActivate {

  constructor(private router : Router) { }
  canActivate(){
    let Activate = SharedStorage.current_user_data &&  ( SharedStorage.current_user_data['category'] == 'seller' || SharedStorage.current_user_data['category'] == 'customer');
    if (Activate){
      return true;
    }
    this.router.navigate(['/home']);
    swal({
      title: 'خطأ',
      type: 'warning',
      showCancelButton: false,
      showConfirmButton: false,
      html: `
      <p> يجب عليك تسجيل الدخول لكي تتمكن من الوصول لهذه الصفحه </p>
      ` ,
    })
    return false;
  }
}
