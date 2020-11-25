export interface PromptConfig {
  timeout?: number;
  slackUrl?: string;
}

export interface ApiUrls {
  apiUrl: string;
  pdp: string;
  title: string;
}

export interface SiteConfig {
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
