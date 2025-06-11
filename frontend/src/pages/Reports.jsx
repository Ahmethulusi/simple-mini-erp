import { useEffect, useState } from 'react';

function Reports() {
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [history, setHistory] = useState(null);
  const [customerId, setCustomerId] = useState("");

 const handleSearch = () => {
  fetch(`${process.env.REACT_APP_API_URL}/api/reports/customer-history/${customerId}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.top_products && Array.isArray(data.top_products)) {
        setHistory(data);
      } else {
        console.error("Geçersiz veri yapısı:", data);
        setHistory(null);
      }
    });
};

useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL}/api/reports/monthly-revenue`)
    .then(res => res.json())
    .then(data => setMonthlyRevenue(data));
}, []);

useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL}/api/reports/low-stock`)
    .then(res => res.json())
    .then(data => setLowStockProducts(data));
}, []);

useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL}/api/reports/top-customers`)
    .then(res => res.json())
    .then(data => setTopCustomers(data));
}, []);

useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL}/api/reports/top-products`)
    .then(res => res.json())
    .then(data => setTopProducts(data));
}, []);


  return (
    <div className="p-6">

      <h3 className="text-lg font-semibold mb-2">📦 En Çok Satılan Ürünler</h3>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-2 px-4 text-left">Ürün</th>
            <th className="py-2 px-4 text-left">Toplam Satış</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.map(p => (
            <tr key={p.id} className="border-t">
              <td className="py-2 px-4">{p.name}</td>
              <td className="py-2 px-4">{p.total_sold}</td>
            </tr>
          ))}
        </tbody>
      </table>

            <h3 className="text-lg font-semibold mt-10 mb-2">💸 En Çok Harcayan Müşteriler</h3>
      <table className="min-w-full bg-white shadow-md rounded-lg mb-8">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-2 px-4 text-left">Müşteri</th>
            <th className="py-2 px-4 text-left">Fatura Sayısı</th>
            <th className="py-2 px-4 text-left">Toplam Harcama</th>
          </tr>
        </thead>
        <tbody>
          {topCustomers.map(c => (
            <tr key={c.id} className="border-t">
              <td className="py-2 px-4">{c.name}</td>
              <td className="py-2 px-4">{c.invoice_count}</td>
              <td className="py-2 px-4">{parseFloat(c.total_spent).toFixed(2)} ₺</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-lg font-semibold mt-10 mb-2">⚠️ Düşük Stoklu Ürünler</h3>
      <table className="min-w-full bg-white shadow-md rounded-lg mb-8">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-2 px-4 text-left">Ürün</th>
            <th className="py-2 px-4 text-left">Stok Miktarı</th>
          </tr>
        </thead>
        <tbody>
          {lowStockProducts.map(p => (
            <tr key={p.id} className="border-t">
              <td className="py-2 px-4">{p.name}</td>
              <td className="py-2 px-4 text-red-600 font-semibold">{p.stock_quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-lg font-semibold mt-10 mb-2">📆 Aylık Fatura Cirosu</h3>
      <table className="min-w-full bg-white shadow-md rounded-lg mb-8">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-2 px-4 text-left">Ay</th>
            <th className="py-2 px-4 text-left">Toplam Ciro</th>
          </tr>
        </thead>
        <tbody>
          {monthlyRevenue.map(r => (
            <tr key={r.month} className="border-t">
              <td className="py-2 px-4">{r.month}</td>
              <td className="py-2 px-4">{parseFloat(r.total_revenue).toFixed(2)} ₺</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-6 max-w-5xl mx-auto space-y-8">

      <h2 className="text-2xl font-bold mb-2">📜 Müşteri Satın Alma Geçmişi</h2>

      <div className="flex items-center gap-4">
        <input
          type="number"
          placeholder="Müşteri ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="p-2 border rounded w-48 shadow-sm focus:ring focus:ring-blue-200"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Ara
        </button>
      </div>

      {history ? (
        <div className="space-y-6">

          {/* MÜŞTERİ BİLGİLERİ */}
          <div className="bg-white border rounded-lg p-6 shadow">
            <h4 className="text-lg font-bold mb-3">👤 Müşteri Bilgileri</h4>
            <div className="space-y-1 text-sm text-gray-700">
              <p><span className="font-semibold">Ad:</span> {history.customer_name}</p>
              <p><span className="font-semibold">Fatura Sayısı:</span> {history.invoice_count}</p>
              <p><span className="font-semibold">Toplam Harcama:</span> {history.total_spent} ₺</p>
              <p><span className="font-semibold">Son Alım:</span> {history.last_purchase.split("T")[0]}</p>
            </div>
          </div>

          {/* EN ÇOK ALINAN ÜRÜNLER */}
          <div>
            <h4 className="text-md font-bold mb-2 text-gray-700">🛒 En Çok Alınan Ürünler</h4>
            <table className="table-auto w-full bg-white border shadow-md rounded-lg">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th className="px-4 py-2 text-left">Ürün</th>
                  <th className="px-4 py-2 text-left">Adet</th>
                </tr>
              </thead>
              <tbody>
                {history.top_products.map((prod, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{prod.name}</td>
                    <td className="px-4 py-2">{prod.total_quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        <p className="text-gray-500 italic mt-4">Müşteri bilgisi gösterilemiyor.</p>
      )}

      </div>



    </div>
  );
}

export default Reports;
