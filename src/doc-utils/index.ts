import {supportedCurrenciesToMarkdown} from "./DocUtils";
import {supportedCurrencies} from "../common";

let markdown = supportedCurrenciesToMarkdown(supportedCurrencies);
console.log(`Supported Currency Markdown:
             ${markdown}`);