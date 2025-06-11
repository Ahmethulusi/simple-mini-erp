
const DiscountStrategy = require('./DiscountStrategy');

class StudentDiscount extends DiscountStrategy {
  calculate(total) {
    
      return total * 0.12;
  }
}

module.exports = StudentDiscount;
