import { Title } from '@angular/platform-browser';
import { AuthenticationService } from './../../../core/shared/services/authentication.service';
import { SeoService } from './../../../core/shared/services/seo.service';
import { SnotifyService } from 'ng-snotify';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  mail = '';
  code = '';
  new_password = '';
  new_password_confirm = '';
  PageType = '';
  constructor(private snotify: SnotifyService,
    private authenti: AuthenticationService,
    private router: Router,
    private seoService : SeoService,private title : Title)  {
      this.title.setTitle('الاأونا - نسيت كلمه المرور')
      this.seoService.createLinkForCanonicalURL();
    }

  ngOnInit() {
  }
  onSendClicked() {
    if (!this.mail || this.mail.indexOf('@') == -1) {
      this.snotify.warning('برجاء كتابه البريد الالكتروني بشكل صحيح');
      return;
    }
    this.authenti.sendPasswordMail(this.mail).subscribe(data => {
      if (data['status'] == 'success') {
        this.PageType = 'CodeSended';
        swal('تم', 'تم ارسال الرساله بنجاح', 'success');
      }
      else {
        swal('خطأ', 'برجاء التحقق من البريد الالكتروني الخاص بك', 'error');
      }
    }, err => {
      swal('خطأ', 'برجاء التحقق من البريد الالكتروني الخاص بك', 'error');
    })
  }
  onChangePassword() {
    if (!this.code || this.code.length != 6) {
      this.snotify.warning('برجاء كتابه الكود بشكل صحيح');
      return;
    }
    if (!this.new_password || !this.new_password_confirm) {
      this.snotify.warning('برجاء كتابه كلمه المرور وتأكيدها');
      return;
    }
    if (this.new_password != this.new_password_confirm) {
      this.snotify.warning('كلمه المرور وتأكيدها غير متطابقان');
      return;
    }

    this.authenti.changePassword(this.code, this.new_password).subscribe(data => {
      if (data['status'] == 'success') {
        swal('تم', 'تم تغير كلمه المرور بنجاح', 'success');
        this.router.navigate(['/auth/user-login']);
      } else {
        swal('خطأ', 'الكود الذي ادخلته غير صحيح برجاء اعاده المحاوله مره اخري', 'error');
      }
    }, err => {
      swal('خطأ', 'الكود الذي ادخلته غير صحيح برجاء اعاده المحاوله مره اخري', 'error');
    })
  }
}
