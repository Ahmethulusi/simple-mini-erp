import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [history, setHistory] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/customers/${id}`)
      .then(res => res.json())
      .then(data => setCustomer(data));

    fetch(`${process.env.REACT_APP_API_URL}/api/reports/customer-history/${id}`)
      .then(res => res.json())
      .then(data => setHistory(data));

      fetch(`${process.env.REACT_APP_API_URL}/api/invoices/customer/${id}`)

      .then(res => res.json())
      .then(data => setInvoices(data));
  }, [id]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_API_URL}/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });
    alert('Cari bilgileri güncellendi.');
  };

  if (!customer) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">👤 Cari Detayı</h2>

      {/* TAB MENU */}
      <div className="flex space-x-4 mb-6 border-b pb-2">
        <button onClick={() => setActiveTab('info')} className={activeTab === 'info' ? 'font-semibold text-blue-600' : ''}>Bilgiler</button>
        <button onClick={() => setActiveTab('reports')} className={activeTab === 'reports' ? 'font-semibold text-blue-600' : ''}>Raporlar</button>
        <button onClick={() => setActiveTab('invoices')} className={activeTab === 'invoices' ? 'font-semibold text-blue-600' : ''}>Faturalar</button>
      </div>

      {/* BILGI FORMU */}
      {activeTab === 'info' && (
        <form onSubmit={handleUpdate} className="space-y-4 bg-white p-4 rounded shadow">
          <input name="name" value={customer.name} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="email" value={customer.email} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="phone" value={customer.phone} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="address" value={customer.address} onChange={handleChange} className="w-full p-2 border rounded" />
          <select name="customer_type" value={customer.customer_type} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="NORMAL">Normal</option>
            <option value="VIP">VIP</option>
            <option value="STUDENT">Öğrenci</option>
            <option value="CORPORATE">Şirket</option>

          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Güncelle</button>
        </form>
      )}

      {/* RAPORLAR */}
      {activeTab === 'reports' && history && (
        <div className="space-y-4 bg-white p-4 rounded shadow">
          <p><strong>Fatura Sayısı:</strong> {history.invoice_count}</p>
          <p><strong>Toplam Harcama:</strong> {history.total_spent} ₺</p>
          <p><strong>Son Alım:</strong> {history.last_purchase.split('T')[0]}</p>
          <h4 className="mt-4 font-bold">En Çok Alınan Ürünler</h4>
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr><th className="text-left p-2">Ürün</th><th className="text-left p-2">Adet</th></tr>
            </thead>
            <tbody>
              {history.top_products.map((p, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.total_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FATURALAR */}
      {activeTab === 'invoices' && (
        <div className="bg-white p-4 rounded shadow">
          {invoices.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">Fatura ID</th>
                  <th className="text-left px-4 py-2">Tutar</th>
                  <th className="text-left px-4 py-2">İndirim</th>
                  <th className="text-left px-4 py-2">Genel Toplam</th>
                  <th className="text-left px-4 py-2">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-t">
                    <td className="px-4 py-2">
                      <Link to={`/invoice/${inv.id}`} className="text-blue-600 hover:underline">
                        {inv.id}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{inv.total_amount} ₺</td>
                    <td className="px-4 py-2 text-red-600">- {inv.discount_applied} ₺</td>
                    <td className="px-4 py-2 font-semibold">{inv.final_amount} ₺</td>
                    <td className="px-4 py-2">{inv.created_at.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 italic">Fatura bulunamadı.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerDetail;
