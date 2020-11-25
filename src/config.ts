import { SiteConfig, PromptConfig } from "./interfaces";

const promptConfig: PromptConfig = {
  // Uncomment and fill these values to skip the prompt step
  // timeout: undefined,
  // slackUrl: undefined,
};

const sitesConfig: SiteConfig[] = [
  {
    name: 'Best Buy',
    urls: [
      'https://www.bestbuy.com/site/nintendo-switch-32gb-console-gray-joy-con/6364253.p?skuId=6364253',
      'https://www.bestbuy.com/site/nintendo-switch-32gb-console-neon-red-neon-blue-joy-con/6364255.p?skuId=6364255',
      'https://www.bestbuy.com/site/nintendo-switch-animal-crossing-new-horizons-edition-32gb-console-multi/6401728.p?skuId=6401728',
      'https://www.bestbuy.com/site/microsoft-xbox-series-x-1tb-console-black/6428324.p?skuId=6428324',
      'https://www.bestbuy.com/site/combo/xbox-series-x-and-s-consoles/40f01d2f-c702-4d6a-9f7e-a0ca343f10b7',
      'https://www.bestbuy.com/site/combo/xbox-series-x-and-s-consoles/bae995a1-12d3-4bc1-a355-8666d4bb729f',
      'https://www.bestbuy.com/site/combo/xbox-series-x-and-s-consoles/0946e97e-3a5d-40cf-a3f3-ec9b123a7415',
      'https://www.bestbuy.com/site/nintendo-switch-neon-blue-neon-red-joy-con-mario-kart-8-deluxe-download-3month-nintendo-switch-online-membership-black-neon-blue-neon-red/6436769.p?skuId=6436769',
      'https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149',
    ],
    titleQuerySelector: '.sku-title h1',
    checkoutButtonQuerySelector: '.fulfillment-add-to-cart-button .btn',
    inStockText: 'Add to Cart',
    parsingMethod: 'scrape',
  },
  {
    name: 'Target',
    apiUrls: [
      {
        apiUrl:
          'https://redsky.target.com/v1/location_details/77464001?latitude=39.863&longitude=-104.988&zip=80260&state=CO&storeId=1372&fulfillment_test_mode=grocery_opu_team_member_test',
        pdp:
          'https://www.target.com/p/nintendo-switch-with-neon-blue-and-neon-red-joy-con/-/A-77464001',
        title: 'Nintendo Switch with Neon Blue and Neon Red Joy-Con',
      },
      {
        apiUrl:
          'https://redsky.target.com/v1/location_details/77464002?latitude=39.863&longitude=-104.988&zip=80260&state=CO&storeId=1372&fulfillment_test_mode=grocery_opu_team_member_test',
        pdp:
          'https://www.target.com/p/nintendo-switch-with-gray-joy-con/-/A-77464002',
        title: 'Nintendo Switch with Gray Joy-Con',
      },
      {
        apiUrl: 'https://redsky.target.com/v1/location_details/80790841?latitude=39.863&longitude=-104.988&zip=80260&state=CO&storeId=1372&fulfillment_test_mode=grocery_opu_team_member_test',
        pdp: 'https://www.target.com/p/xbox-series-x-console/-/A-80790841#lnk=sametab',
        title: 'Xbox Series X Console'
      },
      {
        apiUrl: 'https://redsky.target.com/v1/location_details/81279742?latitude=39.863&longitude=-104.988&zip=80260&state=CO&storeId=1372&fulfillment_test_mode=grocery_opu_team_member_test',
        pdp: 'https://www.target.com/p/nintendo-switch-joy-con-neon-blue-red-mario-kart-8-deluxe-3-month-online-bundle/-/A-81279742',
        title: 'Nintendo Switch Joy-Con Neon Blue/Red + Mario Kart 8 Deluxe + 3 Month Online Bundle'
      },
      {
        apiUrl: 'https://redsky.target.com/v1/location_details/81114595?latitude=39.863&longitude=-104.988&zip=80260&state=CO&storeId=1372&fulfillment_test_mode=grocery_opu_team_member_test',
        pdp: 'https://www.target.com/p/playstation-5-console/-/A-81114595#lnk=sametab',
        title: 'PlayStation 5 Console'
      },
    ],
    inStockApiText: 'AVAILABLE',
    apiJsonPath: 'product.ship_methods.availability_status',
    parsingMethod: 'api',
  },
  {
    name: 'Walmart',
    urls: [
      'https://www.walmart.com/ip/Nintendo-Switch-Bundle-with-Mario-Red-Joy-Con-20-Nintendo-eShop-Credit-Carrying-Case/542896404',
      'https://www.walmart.com/ip/Nintendo-Switch-Bundle-with-Mario-Kart-8-Deluxe-Gray/391444954',
      'https://www.walmart.com/ip/Nintendo-Switch-Bundle-with-Mario-Kart-8-Deluxe-Neon-Red-Blue/539262525',
      'https://www.walmart.com/ip/Nintendo-Switch-Console-with-Neon-Blue-Red-Joy-Con/709776123',
      'https://www.walmart.com/ip/Nintendo-Switch-Console-with-Gray-Joy-Con/994790027',
      'https://www.walmart.com/ip/Nintendo-Switch-Super-Mario-Party-Bundle-Nintendo-Switch-with-Neon-Red-and-Blue-Joy-Con-Super-Mario-Party-Extra-Neon-Green-and-Pink-Joy-Con/161127361',
      'https://www.walmart.com/ip/XB1-Xbox-Series-X/443574645',
      'https://www.walmart.com/ip/Nintendo-Switch-Bundle-with-Mario-Kart-8-Deluxe/702974414',
      'https://www.walmart.com/ip/PlayStation-5-Console/363472942',
    ],
    titleQuerySelector: 'h1.prod-ProductTitle',
    checkoutButtonQuerySelector: '.prod-ProductCTA--primary',
    inStockText: 'Add to cart',
    parsingMethod: 'scrape',
  },
  {
    name: 'pokemoncenter.com',
    urls: [
      'https://www.pokemoncenter.com/product/716-88216/nintendo-switch-with-gray-joy-con',
      'https://www.pokemoncenter.com/product/716-88217/nintendo-switch-with-neon-blue-and-neon-red-joy-con',
    ],
    parsingMethod: 'ld+json',
  },
  {
    name: 'Gamestop',
    urls: [
      'https://www.gamestop.com/video-games/switch/consoles/products/nintendo-switch-with-neon-blue-and-neon-red-joy-con/11095819.html',
      'https://www.gamestop.com/video-games/switch/consoles/products/nintendo-switch-with-gray-joy-con/11095821.html',
      'https://www.gamestop.com/video-games/switch/consoles/products/nintendo-switch-animal-crossing-new-horizons-edition/11100143.html',
      'https://www.gamestop.com/products/xbox-series-x/11108371.html?condition=New',
      'https://www.gamestop.com/nav-consoles-switch-consoles-new/products/nintendo-switch-with-neon-joy-con-mario-kart-8-deluxe-and-nintendo-online-3-month-system-bundle/11110063.html',
      'https://www.gamestop.com/video-games/playstation-5/consoles/products/playstation-5-demons-souls-and-spider-man-system-bundle/B225169J.html',
      'https://www.gamestop.com/video-games/playstation-5/consoles/products/playstation-5-ultimate-gamer-system-bundle/B225169I.html',
      'https://www.gamestop.com/video-games/playstation-5/consoles/products/playstation-5-games-and-accessories-system-bundle/B225169K.html',
    ],
    parsingMethod: 'ld+json',
  },
];

export { sitesConfig, promptConfig };
