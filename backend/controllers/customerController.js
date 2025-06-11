const db = require('../models/db');

// GET /customers
exports.getAllCustomers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM customers');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /customers/:id
exports.getCustomerById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /customers
exports.createCustomer = async (req, res) => {
    const { name, email, phone, address, customer_type } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO customers (name, email, phone, address, customer_type) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, email, phone, address, customer_type]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /customers/:id
exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address, customer_type } = req.body;
    try {
        const result = await db.query(
            `UPDATE customers 
             SET name = $1, email = $2, phone = $3, address = $4, customer_type = $5 
             WHERE id = $6 RETURNING *`,
            [name, email, phone, address, customer_type, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /customers/:id
exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
        res.json({ message: 'Customer deleted', customer: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
