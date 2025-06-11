const db = require('../models/db');
const DiscountService = require('../services/InvoiceService');
const VatService = require('../services/vatService');
const VatSelector = require('../strategies/VAT/VatSelector');
const DiscountStrategySelector = require('../strategies/Discount/DiscountStrategySelector');

// GET /invoices/:id/items
exports.getItemsByInvoiceId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            `SELECT ii.*, p.name AS product_name 
             FROM invoice_items ii 
             JOIN products p ON ii.product_id = p.id 
             WHERE ii.invoice_id = $1`,
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /invoices/:id/items


// controllers/invoiceController.js
exports.addItemToInvoice = async (req, res) => {
  const { id } = req.params;
  const { product_id, quantity } = req.body;

  try {
    const productRes = await db.query(
      'SELECT price, vat_rate FROM products WHERE id = $1',
      [product_id]
    );
    if (productRes.rows.length === 0)
      return res.status(404).json({ error: 'Product not found' });

    const product = productRes.rows[0];
    const unitPrice = parseFloat(product.price);
    const vatRate = parseFloat(product.vat_rate);
    const totalPrice = unitPrice * quantity;

    const vatStrategy = VatSelector.getStrategy(vatRate);

    const vatService = new VatService(vatStrategy);
    const vatAmount = vatService.calculate(totalPrice, vatRate);
    const totalWithVat = totalPrice + vatAmount;

    const itemResult = await db.query(
      `INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, total_price, vat_amount, total_with_vat)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, product_id, quantity, unitPrice, totalPrice, vatAmount, totalWithVat]
    );

    await db.query(
      `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2`,
      [quantity, product_id]
    );

    const sumResult = await db.query(
      `SELECT 
          SUM(total_price) AS total, 
          SUM(vat_amount) AS vat_total 
       FROM invoice_items WHERE invoice_id = $1`,
      [id]
    );

    const totalAmount = parseFloat(sumResult.rows[0].total) || 0;
    const totalVat = parseFloat(sumResult.rows[0].vat_total) || 0;

    const invoiceRes = await db.query(
      `SELECT strategy_type, customer_id FROM invoices WHERE id = $1`,
      [id]
    );
    const invoice = invoiceRes.rows[0];

    // 2. Müşteriyi al
    const customerRes = await db.query(
      'SELECT customer_type FROM customers WHERE id = $1',
      [invoice.customer_id]
    );
    const customer = customerRes.rows[0];
    
    const strategy = DiscountStrategySelector.getStrategy(customer.customer_type); // Uygulanacak indirim stratejisini seç
    const discountService = new DiscountService(strategy); 
    const discount = discountService.calculateTotal(totalAmount); // İndirimi uygula    

    
    const finalAmount = totalAmount + totalVat - discount;

    await db.query(
      `UPDATE invoices
       SET total_amount = $1,
           discount_applied = $2,
           total_vat = $3,
           final_amount = $4
       WHERE id = $5`,
      [totalAmount, discount, totalVat, finalAmount, id]
    );

    const updatedInvoice = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);

    res.status(201).json({
      item: itemResult.rows[0],
      invoice: updatedInvoice.rows[0]
    });

  } catch (err) {
    console.error("Fatura kalemi eklenirken hata:", err.message);
    res.status(500).json({ error: err.message });
  }
};



// DELETE /invoices/:invoiceId/items/:itemIdx
exports.deleteItemFromInvoice = async (req, res) => {
    const { invoiceId, itemId } = req.params;

    try {
        // 1. Mevcut kalem bilgisi
        const item = await db.query(
            `SELECT * FROM invoice_items WHERE id = $1 AND invoice_id = $2`,
            [itemId, invoiceId]
        );
        if (item.rows.length === 0) return res.status(404).json({ error: 'Item not found' });

        // 2. Stok geri yükle
        await db.query(
            `UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2`,
            [item.rows[0].quantity, item.rows[0].product_id]
        );

        // 3. Kalem sil
        const result = await db.query(
            `DELETE FROM invoice_items WHERE id = $1 RETURNING *`,
            [itemId]
        );

        res.json({ message: 'Item deleted', item: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
