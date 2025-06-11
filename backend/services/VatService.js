class VatService {
    constructor(strategy) {
      this.strategy = strategy;
    }
  
    calculate(total) {
      return this.strategy.calculate(total);
    }
  }
  
module.export = VatService;
  
