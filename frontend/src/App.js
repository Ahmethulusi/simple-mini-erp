import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import MainLayout from './layout/MainLayout';
import Invoices from './pages/Invoices';
import InvoiceDetail from './pages/InvoiceDetail';
import Reports from './pages/Reports';
import CustomerDetail from './pages/CustomerDetail';
import ProductDetail from './pages/ProductDetail';




function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>

          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoice/:id" element={<InvoiceDetail />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
