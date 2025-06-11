
const db = require('../models/db');

// GET /products
exports.getAllProducts = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /products/:id
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /products
exports.createProduct = async (req, res) => {
    const { name, description, price, stock_quantity, unit, vat_rate } = req.body;
  
    try {

        const existing = await db.query('SELECT * FROM products WHERE name = $1', [name]);
        if (existing.rows.length > 0) {
        // Güncelle
        await db.query(
            `UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2`,
            [stock_quantity, existing.rows[0].id]
        );
        return res.status(200).json({ message: 'Stok güncellendi' });
        }

        const result = await db.query(
        `INSERT INTO products (name, description, price, stock_quantity, unit, vat_rate) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, description, price, stock_quantity, unit, vat_rate]
        );
  
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Ürün oluşturulurken hata:', err.message);
      res.status(500).json({ error: err.message });
    }
  };
  

// PUT /products/:id
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock_quantity } = req.body;
    try {
        const result = await db.query(
            `UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4 
             WHERE id = $5 RETURNING *`,
            [name, description, price, stock_quantity, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /products/:id
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted', product: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
