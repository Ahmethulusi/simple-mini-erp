
const express = require('express');
const app = express();
const invoiceRoutes = require('./routes/invoiceRoutes');
const pool = require("./models/db");
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const invoiceItemRoutes = require('./routes/invoiceItemRoutes');
const reportRoutes = require('./routes/reportRoutes');

const cors = require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/api', reportRoutes);
app.use('/api', invoiceItemRoutes); // dikkat: prefix sadece /api
app.use('/api/invoices', invoiceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);




// Test sorgusu: bağlantı ve veri kontrolü
pool.query('SELECT * FROM products LIMIT 1', (err, res) => {
    if (err) {
        console.error('❌ Veritabanına bağlanırken hata oluştu:', err.message);
    } else {
        console.log('✅ Veritabanına başarıyla bağlanıldı.');
    }
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


