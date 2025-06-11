
const DiscountStrategy = require('./DiscountStrategy');

class CorporateDiscount extends DiscountStrategy {
  calculate(total) {
      return total * 0.20; 
  }
}

module.exports = CorporateDiscount;
