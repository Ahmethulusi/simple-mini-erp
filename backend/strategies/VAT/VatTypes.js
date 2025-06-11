
const VatStrategy = require('./VatStrategy');

class TwentyPercentVat extends VatStrategy {
  calculate(total) {
    return total * 1.20;
  }
}

class TenPercentVat extends VatStrategy {
  calculate(total) {
    return total * 1.10;
  }
}

class TwoyPercentVat extends VatStrategy {
  calculate(total) {
    return total * 1.02;
  }
}

class OnePercentVat extends VatStrategy {
  calculate(total) {
    return total * 1.01;
  }
}

module.exports = {TwentyPercentVat,TenPercentVat,TwoyPercentVat,OnePercentVat};
