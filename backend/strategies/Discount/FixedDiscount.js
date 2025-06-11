const DiscountStrategy = require('./DiscountStrategy');

class FixedDiscount extends DiscountStrategy {
    calculate(total) {
        return total * 0.05;
    }
}

module.exports = FixedDiscount;


