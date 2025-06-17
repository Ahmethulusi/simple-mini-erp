function processPayment(type, amount) {
    if (type === "credit") {
      // kredi kartı ile öde
    } else if (type === "paypal") {
      // paypal ile öde
    } else if (type === "crypto") {
      if (amount > 1000) {
        // özel kripto işlemi
      } else {
        // standart kripto işlemi
      }
    } else {
      throw new Error("Unsupported payment type");
    }
  }

  

function processPayment(strategy, amount) {
   strategy.process(amount);
}

class CreditCardStrategy { process(amount) { } }
class PaypalStrategy { process(amount) { } }
class CryptoStrategy { process(amount) { } }
