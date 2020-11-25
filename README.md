# switch-scrape

A scraper to notify a user via slack workflows when a nintendo switch is in stock.


## Usage
- `npm install`
- `npm run start`
- Enter the timeout and slack workflow URL you wish to notify at
- Buy Switch!

## Config
There are 3 parsing methods for switchbot. Setting the `parsingMethod` value to one of these terms will define the parsing method for the entry.
### scrape
The scrape method scrapes pages and searches for an elament with provided text. Use `scrape` in for config for this method.
  - `titleQuerySelector` - a query selector for the title of the product
  - `checkoutButtonQuerySelector` - a query selector for the checkout button
  - `inStockText` - the text expected to be found inside of a button for in stock products
  - `urls` - urls you want to scrape
### apiw
The api method scrapes pages and searches through the response of a site's availability api endpoint. Use `api` in for config for this method.
  - `apiUrls` - an array of api url objects to hit.
    - `apiUrl` - the url
    - `pdp` -  a link to the product details page (used to link if product is found)
    - `title` - product title
### ld+json
The ld+json method searches through the json ld data for a page. Use `ld+json` in for config for this method. This method might need to be upgraded to work with all sites. It is in progress.
  - `urls` - urls you want to scrapes
