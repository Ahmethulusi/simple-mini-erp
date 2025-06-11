const db = require('../models/db');

exports.getDashboardSummary = async (req, res) => {
    try {
        const [customerCount, productCount, invoiceCount, totalSales] = await Promise.all([
            db.query('SELECT COUNT(*) FROM customers'),
            db.query('SELECT COUNT(*) FROM products'),
            db.query('SELECT COUNT(*) FROM invoices'),
            db.query('SELECT COALESCE(SUM(final_amount), 0) AS total FROM invoices')
        ]);

        res.json({
            total_customers: parseInt(customerCount.rows[0].count),
            total_products: parseInt(productCount.rows[0].count),
            total_invoices: parseInt(invoiceCount.rows[0].count),
            total_sales: parseFloat(totalSales.rows[0].total)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTopProducts = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                p.id,
                p.name,
                SUM(ii.quantity) as total_sold,
                SUM(ii.total_price) as total_revenue
            FROM invoice_items ii
            JOIN products p ON ii.product_id = p.id
            GROUP BY p.id, p.name
            ORDER BY total_sold DESC
            LIMIT 5
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTopCustomers = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                c.id,
                c.name,
                COUNT(i.id) as invoice_count,
                SUM(i.final_amount) as total_spent
            FROM invoices i
            JOIN customers c ON i.customer_id = c.id
            GROUP BY c.id, c.name
            ORDER BY total_spent DESC
            LIMIT 5
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getLowStockProducts = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM products WHERE stock_quantity < 10 ORDER BY stock_quantity ASC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCustomerHistory = async (req, res) => {
    const { id } = req.params;

    try {
        // Müşteri kontrolü
        const customer = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
        if (customer.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });

        // Temel geçmiş bilgisi
        const [invoiceStats, lastInvoice, topItems] = await Promise.all([
            db.query(`
                SELECT 
                    COUNT(*) as invoice_count,
                    SUM(final_amount) as total_spent
                FROM invoices
                WHERE customer_id = $1
            `, [id]),

            db.query(`
                SELECT created_at 
                FROM invoices
                WHERE customer_id = $1
                ORDER BY created_at DESC
                LIMIT 1
            `, [id]),

            db.query(`
                SELECT 
                    p.name,
                    SUM(ii.quantity) AS total_quantity
                FROM invoices i
                JOIN invoice_items ii ON i.id = ii.invoice_id
                JOIN products p ON ii.product_id = p.id
                WHERE i.customer_id = $1
                GROUP BY p.name
                ORDER BY total_quantity DESC
                LIMIT 3
            `, [id])
        ]);

        res.json({
            customer_id: id,
            customer_name: customer.rows[0].name,
            invoice_count: parseInt(invoiceStats.rows[0].invoice_count) || 0,
            total_spent: parseFloat(invoiceStats.rows[0].total_spent) || 0,
            last_purchase: lastInvoice.rows[0]?.created_at || 'Hiç alışveriş yapılmamış',
            top_products: topItems.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMonthlyRevenue = async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          TO_CHAR(created_at, 'YYYY-MM') AS month,
          SUM(final_amount) AS total_revenue
        FROM invoices
        GROUP BY month
        ORDER BY month;
      `);
  
      res.json(result.rows);
    } catch (err) {
      console.error('Aylık ciro hatası:', err);
      res.status(500).json({ error: 'Aylık fatura cirosu alınamadı' });
    }
  };
  


