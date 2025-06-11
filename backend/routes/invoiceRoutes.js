const express = require('express');
const router = express.Router();
const controller = require('../controllers/invoiceController');

router.get('/', controller.getInvoices); // tek endpoint, filtre içeride
router.post('/', controller.createInvoice); // tek endpoint, filtre içeride
router.get('/customer/:customer_id', controller.getInvoicesByCustomerID);
router.get('/:id', controller.getInvoiceById);
router.delete('/:id', controller.deleteInvoice);


module.exports = router;
