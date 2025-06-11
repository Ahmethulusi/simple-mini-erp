const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');

router.get('/reports/monthly-revenue', controller.getMonthlyRevenue);
router.get('/dashboard/summary', controller.getDashboardSummary);
router.get('/reports/top-products', controller.getTopProducts);
router.get('/reports/top-customers', controller.getTopCustomers);
router.get('/reports/low-stock', controller.getLowStockProducts);
router.get('/reports/customer-history/:id', controller.getCustomerHistory);

module.exports = router;
