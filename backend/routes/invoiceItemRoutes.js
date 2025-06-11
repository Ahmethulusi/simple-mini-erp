const express = require('express');
const router = express.Router();
const controller = require('../controllers/invoiceItemController');

router.delete('/invoices/:invoiceId/items/:itemId', controller.deleteItemFromInvoice);
router.get('/invoices/:id/items', controller.getItemsByInvoiceId);
router.post('/invoices/:id/items', controller.addItemToInvoice);

module.exports = router;
