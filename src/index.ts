import { JSDOM } from 'jsdom';
import prompt from 'prompt';
import fetch from 'node-fetch';
import { get, unescape } from 'lodash';
import request from 'request';
import { sitesConfig, promptConfig } from './config';

async function scrapeUrlForAvailability(
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
      // 🎵 tell me lies, tell me sweet little lies 🎵
      'User-Agent': 'curl/ 7.64.1',
      'Accept': '*/*',
    },
    body: undefined,
    method: 'GET',
  }).catch(e => {
    console.log(e);
  });

  if (!result) {
    return false;
  }

  let parsed = '';
  try {
    parsed = await result.json();
  } catch (error) {
    console.log(error);
  }
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
  for (const site of sitesConfig) {
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
              await scrapeUrlForAvailability(
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

if (promptConfig && promptConfig.slackUrl && promptConfig.timeout) {
  main(
    promptConfig.timeout,
    promptConfig.slackUrl
  );
} else {
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
  prompt.get(schema, function (
    err: any,
    { timeout, slackWorkflowUrl }: any,
  ) {
    main(timeout, slackWorkflowUrl);
  });
}

