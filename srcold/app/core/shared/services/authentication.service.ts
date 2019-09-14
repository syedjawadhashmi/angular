import { sharedClass } from './../sharedattrubite';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  io;
  constructor(private http: TransferHttpService) { }
  login(UserData) {
    const URL = `${sharedClass.BASE_URL}/auth/login`;
    return this.http.post(URL, UserData);
  }
  signup(UserData) {
    const URL = `${sharedClass.BASE_URL}/auth/signup`;
    return this.http.post(URL, UserData);
  }
  varifySocial(UserData) {
    const URL = `${sharedClass.BASE_URL}/auth/social`;
    return this.http.post(URL, UserData);
  }
  varifey(Token) {
    const URL = `${sharedClass.BASE_URL}/auth/varify`;
    return this.http.post(URL, { token: Token });
  }
  EditUserProfile(UserData) {
    const URL = `${sharedClass.BASE_URL}/auth/edit`;
    return this.http.post(URL, UserData);
  }

  GetUseNotifications(user_id, offset) {
    const URL = `${sharedClass.BASE_URL}/notification?user_id=${user_id}&offset=${offset}`;
    return this.http.get(URL);
  }
  deleteUserNotification(id) {
    const URL = `${sharedClass.BASE_URL}/notification/remove`;
    return this.http.post(URL, { id: id });
  }
  sendPasswordMail(email) {
    let URL = `${sharedClass.BASE_URL}/auth/password/mail`;
    return this.http.post(URL, { email: email });
  }
  changePassword(token, password) {
    let URL = `${sharedClass.BASE_URL}/auth/password/reset`;
    return this.http.post(URL, { token: token, password: password });
  }


  getSettingData() {
    let URL = `${sharedClass.BASE_URL}/setting`;
    return this.http.get(URL);
  }

}
