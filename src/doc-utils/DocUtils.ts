import {CurrencyData} from "../common";
export const supportedCurrenciesToMarkdown = (currencies: CurrencyData[]): string => {
  let markdown = "";
  for(let i = 0; i < currencies.length; i++) {
    markdown += `**${currencies[i].symbol}** | ${currencies[i].label} | ${currencies[i].isFiat} | \n`;
  }

  return markdown;
};





