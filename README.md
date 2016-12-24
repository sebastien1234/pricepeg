# Syscoin Price Peg

STuff here about what the peg does

Installing
---
To install the Syscoin price peg you must first have NPM and Node installed (v7+). Clone the project contents and from the project folder in CLI run `npm install`. Next you'll
want to modify `dist/config.js` and change the values there to ones representative of the environment you're hosting as a peg. Then in CLI simply run `node dist/server` to get
the peg server up and running.

Building
---
Developers looking to build from source after making modifications need only run `npm run build` to rebuild the source and all new resources to `dist`.

Further Development
---
If you want to help please issue pull requests and they will readily be reviewed and accepted. All development changes should 
happen in `/src` folder. The project currently uses ES6 and [loose] Typescript with Node for the build process.

Planned improvements:
1. Improve data request/caching pattern
2. Improve build process- both for development and for release
3. Implement local mongodb for peg history so server restarts don't lose history, or use aliashistory to display this information in a paginated way.
4. Make History page prettier.


