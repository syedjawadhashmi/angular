import { LOCAL_STORAGE, WINDOW } from "@ng-toolkit/universal";
import { OneSignalService } from "./core/shared/services/OneSignalService";
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  Renderer,
  OnDestroy,
  NgZone,
  AfterViewInit/*,
  ViewEncapsulation*/
} from "@angular/core";
import { delay } from 'rxjs/internal/operators';
import { FeedService } from './services/feed.service';
import { FeedEntry } from './api/feed-entry';
import { environment } from '../environments/environment';
import { AuthenticationService } from "./core/shared/services/authentication.service";

import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  PRIMARY_OUTLET
} from "@angular/router";
import { SharedStorage } from "./core/shared/storageShared";
import {
  trigger,
  state,
  transition,
  style,
  animate
} from "@angular/animations";
import { isPlatformBrowser } from '@angular/common';

import { BroadcasterService } from "ng-broadcaster";
import { BreadCrumb } from "./core/interfaces/breadcrumb";
import { filter } from "rxjs/operators";
import * as socketIOClient from "socket.io-client";
import * as sailsIOClient from "sails.io.js";
import { SnotifyService } from "ng-snotify";
import  "rxjs/operators";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css",
'../assets/addtohomescreen.css'],
//  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("fade", [
      state("void", style({ opacity: 0 })),
      transition(":enter", [animate(300)]),
      transition(":leave", [animate(500)])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  feedLocation = environment.feedLocation + '?v=' + Math.random();
  title = "alauana";
  feeds: Array<FeedEntry> = [];
  _opened = false;
  UserData;
  listenFunc;
  @ViewChild("inner") inner: ElementRef;

  public breadcrumbs: BreadCrumb[];
 
  constructor(
    private feedService: FeedService,
    private elementRef: ElementRef,
    @Inject(WINDOW) private window: Window,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    private authService: AuthenticationService,
    private broadCaster: BroadcasterService,
    public router: Router,
    private oneSignalService: OneSignalService,
    private renderer: Renderer,
    private activatedRoute: ActivatedRoute,
    private ngzone: NgZone,
    private snotifiy: SnotifyService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.RemberUser();
    this.broadCaster.on("toggleMenu").subscribe(data => {
      this._toggleSidebar();
    });
    this.broadCaster.on("UserSign").subscribe(data => {
      this.UserData = SharedStorage.current_user_data;
      // console.log(this.UserData);
    });
  }
  ngOnInit() {
    this.refreshFeed();
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      console.log("navigation changed");
      this.inner.nativeElement.parentElement.scrollTop = 0;
    });
    let breadcrumb: BreadCrumb = {
      label: "الرئيسيه",
      url: ""
    };

    if(isPlatformBrowser(this.platformId)) { // check if this is runing in browser
      // this.ngzone.runOutsideAngular(() => {
        this.authService.io = sailsIOClient(socketIOClient);
        // this.authService.io.sails.useCORSRouteToGetCookie = false;
        // this.authService.io.sails.rejectUnauthorized = false;
        // this.authService.io.sails.initialConnectionHeaders = {nosession: true};
        // this.authService.io.sails.transports = ['websocket'];
        this.authService.io.sails.url = "http://198.38.89.216:1338";

        this.authService.io.socket.on("connect", data => {
          // this.authService.io.socket.on("newMessage", message => {
          //   this.ngzone.run(() => {
          //     if (
          //       this.activatedRoute.routeConfig.component.name != "ChatComponent" &&
          //       this.activatedRoute.routeConfig.component.name != "ChatComponent" 
          //     ) {
          //       this.snotifiy.create({
          //         title: "رساله جديده",
          //         body: message["text"]
          //         // foreground: true
          //       });
          //     }
          //   });
          // });
        });
      // })
    }


    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        console.log(this.router.url);
        //set breadcrumbs
        let root: ActivatedRoute = this.activatedRoute.root;
        this.breadcrumbs = this.getBreadcrumbs(root);
        this.breadcrumbs = [breadcrumb, ...this.breadcrumbs];
        console.log(this.breadcrumbs);
      });
    // We cache the function "listen" returns

    this.listenFunc = this.renderer.listen(
      this.inner.nativeElement.parentElement,
      "scroll",
      event => {
        this.window.scroll();

        if (event.target.scrollTop > 250) {
          let element =
            document.getElementById("navbar") ||
            ({
              classList: { add: function(param) {}, remove: function(param) {} }
            } as any);
          element.classList.add("sticky");
          let Homeelement = document.getElementById("homeSection");
          Homeelement.style.paddingTop = "80px";
        } else {
          let element =
            document.getElementById("navbar") ||
            ({
              classList: { add: function(param) {}, remove: function(param) {} }
            } as any);
          element.classList.remove("sticky");
          let Homeelement = document.getElementById("homeSection");
          Homeelement.style.paddingTop = "0px";
        }
      }
    );
  }

  ngAfterViewInit() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = 'addToHomescreen();';
    //this.elementRef.nativeElement.appendChild(script);
}

refreshFeed() {
  this.feeds.length = 0;

  this.feedService.getFeedContent(this.feedLocation).pipe(delay(500))
      .subscribe(
          feed => {
            // console.log('feed: ' , feed);
            this.title = feed.rss.channel.description;
            this.feeds = feed.rss.channel.item;
          } ,
          error => console.log(error));
}

openLinkInBrowser(feed: { link: string; }) {
  window.open(feed.link);
}

  RemberUser() {
    const token = this.localStorage.getItem("token");
    this.authService.varifey(token).subscribe(
      data => {
        // console.log(data);
        if (data["status"] === "success") {
          SharedStorage.current_user_data = data["data"];
          this.oneSignalService.init(
            data["data"]["category"],
            data["data"]["id"],
            data["data"]["category"] == "seller"
              ? data["data"]["markets"][0].id
              : ""
          );
          this.broadCaster.broadcast("UserSisgn");
        }
      },
      err => {}
    );
  }
  _toggleSidebar() {
    this._opened = !this._opened;
  }
  onActivate(event) {
    console.log("hello");
    // this.window.scroll(0, 0);
    this.inner.nativeElement.parentElement.scrollTop = 0;
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
  }
  private getBreadcrumbs(
    route: ActivatedRoute,
    url: string = "",
    breadcrumbs: BreadCrumb[] = []
  ): BreadCrumb[] {
    const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";
    // debugger;
    //get the child routes
    let children: ActivatedRoute[] = route.children;

    //return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    //iterate over each children
    for (let child of children) {
      //verify primary route
      if (child.outlet !== PRIMARY_OUTLET || child.snapshot.url.length == 0) {
        continue;
      }

      //verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      //get the route's URL segment
      let routeURL: string = child.snapshot.url
        .map(segment => segment.path)
        .join("/");

      //append route URL to URL
      url += `/${routeURL}`;

      //add breadcrumb
      let breadcrumb: BreadCrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        url: url
      };
      breadcrumbs.push(breadcrumb);

      //recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }

  ngOnDestroy() {
    this.listenFunc();
  }
}