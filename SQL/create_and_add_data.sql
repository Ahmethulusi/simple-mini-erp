-- DROP önce, çünkü dünya acımasız
DROP TABLE IF EXISTS invoice_items;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS products;

-- Ürün Tablosu
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Müşteri Tablosu
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    customer_type VARCHAR(50), -- 'NORMAL', 'VIP', vs.
    created_at TIMESTAMP DEFAULT NOW()
);

-- Fatura Tablosu
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    total_amount NUMERIC(10,2),
    discount_applied NUMERIC(10,2),
    final_amount NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Fatura Kalemleri
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL
);

-- Ürün Verileri
INSERT INTO products (name, description, price, stock_quantity) VALUES
('Kalem', 'Mavi tükenmez kalem', 5.50, 200),
('Defter', 'Çizgili defter A5', 15.00, 150),
('USB Bellek', '16GB USB 3.0 bellek', 85.90, 80),
('Klavye', 'Mekanik klavye', 299.99, 30),
('Mouse', 'Kablosuz mouse', 149.95, 50);


-- Cari Verileri
INSERT INTO customers (name, email, phone, address, customer_type) VALUES
('Ali Yılmaz', 'ali@example.com', '05001112233', 'İstanbul', 'NORMAL'),
('Ayşe Demir', 'ayse@example.com', '05002223344', 'Ankara', 'VIP'),
('Mehmet Koç', 'mehmet@example.com', '05003334455', 'İzmir', 'NORMAL'),
('Zeynep Öz', 'zeynep@example.com', '05004445566', 'Bursa', 'VIP');
