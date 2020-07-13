import { JSDOM } from 'jsdom';
import prompt from 'prompt';
import fetch from 'node-fetch';
import { get, unescape } from 'lodash';
import request from 'request';

interface ApiUrls {
  apiUrl: string;
  pdp: string;
  title: string;
}

interface SiteConfig {
  name?: string;
  parsingMethod?: string;

  // Scraper Version
  urls?: string[];
  titleQuerySelector?: string;
  checkoutButtonQuerySelector?: string;
  inStockText?: string;

  // API Version
  apiUrls?: ApiUrls[];
  inStockApiText?: string;
  apiJsonPath?: string;
}

const sites: SiteConfig[] = [
  {
    name: 'Best Buy',
    urls: [
      'https://www.bestbuy.com/site/nintendo-switch-32gb-console-gray-joy-con/6364253.p?skuId=6364253',
      'https://www.bestbuy.com/site/nintendo-switch-32gb-console-neon-red-neon-blue-joy-con/6364255.p?skuId=6364255',
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

async function checkUrlForAvailability(
  url: string,
  titleQuerySelector: string | undefined,
  checkoutButtonQuerySelector: string | undefined,
  inStockText: string | undefined,
) {
  try {
    const dom = await JSDOM.fromURL(url, {
      pretendToBeVisual: true,
      resources: 'usable',
      runScripts: 'outside-only',
    });

    let titleVal = '';
    try {
      titleVal = dom.window.document.querySelector(titleQuerySelector)
        .textContent;
      console.log(`  ${titleVal}`);
    } catch (error) {
      console.log(error.message);
    }

    let checkoutButtonVal = '';
    try {
      const button = dom.window.document.querySelector(
        checkoutButtonQuerySelector,
      );

      if (button) {
        checkoutButtonVal = button.textContent;
      }
    } catch (error) {
      console.log(error.message);
    }

    if (checkoutButtonVal === inStockText) {
      console.log('    -- Available!');
      console.log(url);
      return true;
    }
  } catch (error) {
    console.log(error);
  }

  console.log('    -- Out Of Stock.');
  return false;
}

async function checkApiForAvailability(
  url: string,
  pdpUrl: string,
  path: any,
  inStockText: any,
  titleVal: string,
) {
  console.log(`  ${titleVal}`);
  const result = await fetch(url, {
    headers: {
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    },
    body: undefined,
    method: 'GET',
  }).catch(e => {
    console.log(e);
  });

  if (!result) {
    return false;
  }

  const parsed = await result.json();
  const availability = get(parsed, path);

  if (availability === inStockText) {
    console.log('    -- Available!');
    console.log(pdpUrl);
    return true;
  }

  console.log('    -- Out Of Stock.');
  return false;
}

async function checkJsonLdForAvailability(url: string) {
  try {
    const dom = await JSDOM.fromURL(url, {
      pretendToBeVisual: true,
      resources: 'usable',
    });

    console.log(url);

    const jsonLD = JSON.parse(
      unescape(
        dom.window.document.querySelector('[type="application/ld+json"]')
          .textContent,
      ),
    );
    const offer = Array.isArray(jsonLD.offers)
      ? jsonLD.offers[0]
      : jsonLD.offers;

    if (
      offer.availability === 'http://schema.org/InStock' ||
      offer.availability === 'https://schema.org/InStock'
    ) {
      console.log('    -- Available!');
      return true;
    }
  } catch (error) {
    console.log(error.message);
  }

  console.log('    -- Out Of Stock.');
  return false;
}

async function sendSlack(availabilities: any, slackWorkflowUrl: string) {
  try {
    const message = `
      *🤩It's Time To Buy🤩*
      ${availabilities.map((url: any) => `* ${url}`).join('')}
    `;
    console.log('Sending Slack Message... ');
    request.post({
      url: slackWorkflowUrl,
      body: JSON.stringify({
        message,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

async function main(timeout: any, slackWorkflowUrl: string) {
  const date = new Date();
  console.log(`\n${date.toLocaleDateString('en-US')} ${date.toTimeString()}`);

  const availabilities = [];
  for (const site of sites) {
    console.log(`----${site.name}----`);

    switch (site.parsingMethod) {
      case 'ld+json':
        if (site.urls) {
          for (const url of site.urls) {
            if (await checkJsonLdForAvailability(url)) {
              availabilities.push(url);
            }
          }
        }
        break;
      case 'api':
        if (site.apiUrls) {
          for (const urls of site.apiUrls) {
            if (
              await checkApiForAvailability(
                urls.apiUrl,
                urls.pdp,
                site.apiJsonPath,
                site.inStockApiText,
                urls.title,
              )
            ) {
              availabilities.push(urls.pdp);
            }
          }
        }
        break;
      default:
        if (site.urls) {
          for (const url of site.urls) {
            if (
              await checkUrlForAvailability(
                url,
                site.titleQuerySelector,
                site.checkoutButtonQuerySelector,
                site.inStockText,
              )
            ) {
              availabilities.push(url);
            }
          }
        }
        break;
    }
  }

  if (availabilities.length > 0) {
    console.log('Sending slack message');
    sendSlack(availabilities, slackWorkflowUrl);
  }

  setTimeout(() => main(timeout, slackWorkflowUrl), timeout * 1000);
}

const schema = {
  properties: {
    timeout: {
      default: 60,
      message: 'Timeout between checks (seconds)',
    },
    slackWorkflowUrl: {
      message: 'Slack workflow URL',
    },
  },
};

prompt.start();
prompt.get(schema, function(
  err: any,
  { timeout, slackWorkflowUrl }: any,
) {
  main(timeout, slackWorkflowUrl);
});
