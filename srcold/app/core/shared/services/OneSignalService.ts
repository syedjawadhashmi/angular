import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { Injectable, Inject } from '@angular/core';
let OneSignal;
@Injectable()
export class OneSignalService {
  oneSignalInit; // to check if OneSignal is already initialized.
  oneSignalId: any; // store OneSignalId in localStorage
  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, ) {
    console.log('OneSignal Service Init', this.oneSignalInit);
    this.oneSignalInit = undefined;
  }
  // Call this method to start the onesignal process.
  public init(category, user_id , market_id) {
    this.oneSignalInit ? console.log('Already Initialized') : this.addScript('https://cdn.onesignal.com/sdks/OneSignalSDK.js', (callback) => {
      console.log('OneSignal Script Loaded');
      this.initOneSignal(user_id, category , market_id);
    });
  }
  addScript(fileSrc, callback) {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = callback;
    script.src = fileSrc;
    head.appendChild(script);
  }
  initOneSignal(user_id, category , market_id) {
    OneSignal = this.window['OneSignal'] || [];
    OneSignal.sendTags({ 'category': category, 'user_id': user_id , 'market_id' : market_id });
    console.log('Init OneSignal');
    if (category == 'seller'){
      OneSignal.push(['init', {
        appId: '44f6d1b5-7d2b-4363-9d0f-72ff6eea1496',
        autoRegister: true,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: false,
        },
      }]);
    } else {
      OneSignal.push(['init', {
        appId: '71526830-2514-4982-80e4-fa16933ec33b',
        autoRegister: true,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: false,
        },
      }]);
    }
    console.log('OneSignal Initialized');
    this.localStorage.setItem('oneSignalInit', 'true');
    this.checkIfSubscribed();
  }
  subscribe() {
    OneSignal.push(() => {
      console.log('Register For Push');
      OneSignal.push(['registerForPushNotifications']);
      OneSignal.on('subscriptionChange', (isSubscribed) => {
        console.log('The user\'s subscription state is now:', isSubscribed);
        this.listenForNotification();
        OneSignal.getUserId().then((userId) => {
          console.log('User ID is', userId);
          this.oneSignalId = userId;
          this.updateLocalUserProfile();
        });
      });
    });
  }
  listenForNotification() {
    console.log('Initalize Listener');
    OneSignal.on('notificationDisplay', (event) => {
      console.log('OneSignal notification displayed:', event);
      this.listenForNotification();
    });
  }
  getUserID() {
    OneSignal.getUserId().then((userId) => {
      console.log('User ID is', userId);
      this.oneSignalId = userId;
    });
  }
  checkIfSubscribed() {
    OneSignal.push(() => {
      /* These examples are all valid */
      OneSignal.isPushNotificationsEnabled((isEnabled) => {
        if (isEnabled) {
          console.log('Push notifications are enabled!');
          this.getUserID();
        }
        else {
          console.log('Push notifications are not enabled yet.');
          this.subscribe();
        }
      }, (error) => {
        console.log('Push permission not granted');
      });
    });
  }
  updateLocalUserProfile() {
    // Store OneSignal ID in your server for sending push notificatios.
  }
}
