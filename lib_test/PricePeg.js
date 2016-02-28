var PricePeg = function PricePeg() {
  console.log("price peg construct");
}

PricePeg.prototype.hello = function () {
    console.log("hello from pricepeg base, testing watch.");
}

module.exports = PricePeg;

