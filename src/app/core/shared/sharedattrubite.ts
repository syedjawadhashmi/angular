import { HttpHeaders } from '@angular/common/http';
// tslint:disable-next-line:class-name
export class sharedClass {
  // online section
  public static BASE_URL = 'https://alaunna.com/api';
  public static IMAGE_BASE_URL = 'https://alaunna.com/api/images';
  public basic_header = new HttpHeaders({
    'authentication' : 'D16BC84DD47DF51AF315D6898A7DB521A347752567C263AE999CC2CEDF'
  })
}
