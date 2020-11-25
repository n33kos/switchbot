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
    ],
    parsingMethod: 'ld+json',
  },
];

export { sitesConfig, promptConfig };
