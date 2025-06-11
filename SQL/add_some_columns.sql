UPDATE invoices
SET total_amount = 1337, discount_applied = 100, final_amount = 1237
WHERE id = 1;

SELECT * FROM invoices;
SELECT * FROM invoice_items where invoice_id = 6;
SELECT * FROM products;

ALTER TABLE invoices
ADD COLUMN strategy_type TEXT;


ALTER TABLE products
ADD COLUMN unit VARCHAR(20) DEFAULT 'Adet';

ALTER TABLE products
ADD COLUMN vat_rate NUMERIC(5,2) DEFAULT 18.00;


-- opsiyonel
ALTER TABLE invoice_items
ADD COLUMN vat_amount NUMERIC(10,2),
ADD COLUMN total_with_vat NUMERIC(10,2);


ALTER TABLE invoices
  ADD COLUMN total_vat NUMERIC(10,2) DEFAULT 0;
