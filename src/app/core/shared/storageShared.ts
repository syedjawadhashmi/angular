export class SharedStorage {
  public static cities: Array<any> = [];
  public static countries: Array<any> = [];

  public static product_categories: Array<any> = [];
  public static product_subcategories: Array<any> = [];
  public static product_subsubcategories: Array<any> = [];

  public static current_product_data: any;
  public static current_makret_data: any;
  public static current_user_data: any;
  public static device_id: any;
  public static currentOfferData: any;
  public static SelectedProducts: any;
  public static WholeSelectedProducts: any;
  public static current_user_cart = {
    total_price: 0,
    total_quantity: 0, total_items: 0,
    sutiable_place: '',
    sutiable_time: '',
    products: [], productsData: [], market_id: -1, marketData: {}
  };
  public static curent_option;
  public static sideSubcategories;
  public static sidecatWithMarkets;

}
