const {
    TwentyPercentVat,
    TenPercentVat,
    TwoyPercentVat,
    OnePercentVat,
  } = require('./VatTypes'); // bu dosyadaki sınıfların olduğu yer
  
  class VatStrategyFactory {
    static getStrategy(vatRate) {
      switch (vatRate) {
        case 20:
          return new TwentyPercentVat();
        case 10:
          return new TenPercentVat();
        case 2:
          return new TwoyPercentVat();
        case 1:
          return new OnePercentVat();
        default:
          throw new Error(`Unsupported VAT rate: ${vatRate}`);
      }
    }
  }
  
  module.exports = VatStrategyFactory;
  