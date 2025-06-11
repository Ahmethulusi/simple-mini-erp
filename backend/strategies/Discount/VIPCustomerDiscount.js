const DiscountStrategy = require('./DiscountStrategy');

class VIPCustomerDiscount extends DiscountStrategy {
    calculate(total) {
        return total * 0.30;
    }
}

module.exports = VIPCustomerDiscount;
