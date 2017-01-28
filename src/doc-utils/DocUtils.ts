import {CurrencyData} from "../common";
import {capitalizeFirstLetterLowercaseWordPerWord} from "../data/Utils";
export const supportedCurrenciesToMarkdown = (currencies: CurrencyData[]): string => {
  let markdown = "";
  for(let i = 0; i < currencies.length; i++) {
    markdown += `**${currencies[i].symbol}** | ${capitalizeFirstLetterLowercaseWordPerWord(currencies[i].label)} | ${currencies[i].isFiat} | \n`;
  }

  return markdown;
};





