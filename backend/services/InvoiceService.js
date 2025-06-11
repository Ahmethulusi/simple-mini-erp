

class InvoiceService {
    constructor(discountStrategy) {
        this.discountStrategy = discountStrategy;
    }

    calculateTotal(total) {
        return this.discountStrategy.calculate(total);
    }
}

module.export = InvoiceService;
