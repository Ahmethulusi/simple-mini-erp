const VIPCustomerDiscount = require('./VIPCustomerDiscount');
const StudentDiscount = require('./StudentDiscount');
const CorporateDiscount = require('./CorporateDiscount');
const FixedDiscount = require('./FixedDiscount');

class DiscountStrategySelector {
  static getStrategy(customerType) {
    switch (customerType) {
      case 'VIP':
        return new VIPCustomerDiscount();
      case 'STUDENT':
        return new StudentDiscount();
      case 'CORPORATE':
        return new CorporateDiscount();
      case 'NORMAL':
        return new FixedDiscount();
      default:
        return console.error("Strateji Bulunamadi !");
         
    }
  }
}

module.exports = DiscountStrategySelector;

