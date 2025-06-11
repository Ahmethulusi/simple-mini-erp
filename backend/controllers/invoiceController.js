
const db = require('../models/db');
const DiscountService = require('../services/InvoiceService');
const DiscountStrategySelector = require('../strategies/Discount/DiscountStrategySelector');
// GET /invoices
exports.getInvoices = async (req, res) => {
    try {
      const result = await db.query(`
        SELECT i.*, c.name AS customer_name
        FROM invoices i
        JOIN customers c ON i.customer_id = c.id
        ORDER BY i.created_at DESC
      `);
      res.json(result.rows);
    } catch (err) {
      console.error('Faturalar alınırken hata:', err.message);
      res.status(500).json({ error: err.message });
    }
  };
  

// GET /invoices/:id
exports.getInvoiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getInvoicesByCustomerID = async (req, res) => {
  const { customer_id } = req.params;

  try {
    let result;

    if (!isNaN(parseInt(customer_id))) {
      result = await db.query(
        `SELECT invoices.*, customers.name AS customer_name 
         FROM invoices 
         JOIN customers ON invoices.customer_id = customers.id 
         WHERE customer_id = $1 
         ORDER BY created_at DESC`,
        [customer_id]
      );
    } else {
      result = await db.query(
        `SELECT invoices.*, customers.name AS customer_name 
         FROM invoices 
         JOIN customers ON invoices.customer_id = customers.id 
         ORDER BY created_at DESC`
      );
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Faturalar alınamadı:", err.message);
    res.status(500).json({ error: err.message });
  }
};




// POST /invoices

exports.createInvoice = async (req, res) => {
  const { customer_id, items } = req.body;

  try {
    const customerRes = await db.query('SELECT * FROM customers WHERE id = $1', [customer_id]);
    if (customerRes.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });

    const customer = customerRes.rows[0];

    // Ürünleri çek
    const productIds = items.map(i => i.product_id);
    const productQuery = await db.query(
      `SELECT * FROM products WHERE id = ANY($1::int[])`,
      [productIds]
    );

    let totalAmount = 0;
    let totalVat = 0;

    const itemRecords = [];

    // Önce fatura oluşturulacağı için ID lazım
    const draftInvoice = await db.query(
      `INSERT INTO invoices (customer_id, total_amount, discount_applied, total_vat, final_amount)
       VALUES ($1, 0, 0, 0, 0) RETURNING *`,
      [customer_id]
    );

    const invoiceId = draftInvoice.rows[0].id;

    // Fatura kalemlerini ekle ve tutarları hesapla
    for (const item of items) {
      const product = productQuery.rows.find(p => p.id === parseInt(item.product_id));
      if (!product) continue;

      const quantity = parseInt(item.quantity);
      const price = parseFloat(product.price);
      const vatRate = parseFloat(product.vat_rate);
      const lineTotal = price * quantity;
      const lineVat = (lineTotal * vatRate) / 100;
      const totalWithVat = lineTotal + lineVat;

      // Fatura kalemi oluştur
      const insertItem = await db.query(
        `INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, total_price, vat_amount, total_with_vat)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [invoiceId, item.product_id, quantity, price, lineTotal, lineVat, totalWithVat]
      );

      // Stok düş
      await db.query(
        `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2`,
        [quantity, item.product_id]
      );

      itemRecords.push(insertItem.rows[0]);
      totalAmount += lineTotal;
      totalVat += lineVat;
    }

   
    const strategy = DiscountStrategySelector.getStrategy(customer.customer_type); // Uygulanacak indirim stratejisini seç
    const discountService = new DiscountService(strategy); 
    const discountApplied = discountService.calculateTotal(totalAmount); // İndirimi uygula

    const finalAmount = totalAmount + totalVat - discountApplied;

    // Faturayı güncelle
    await db.query(
      `UPDATE invoices
       SET total_amount = $1,
           discount_applied = $2,
           total_vat = $3,
           final_amount = $4
       WHERE id = $5`,
      [totalAmount, discountApplied, totalVat, finalAmount, invoiceId]
    );

    // Son hali getir
    const updatedInvoice = await db.query(`SELECT * FROM invoices WHERE id = $1`, [invoiceId]);
    const invoice = updatedInvoice.rows[0];

    res.status(201).json({ ...invoice, items: itemRecords });

  } catch (err) {
    console.error('Fatura oluşturulurken hata:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /invoices/:id
exports.deleteInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM invoices WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
        res.json({ message: 'Invoice deleted', invoice: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

