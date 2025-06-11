import { useEffect, useState } from 'react';
import Reports from './Reports.jsx';

function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/dashboard/summary`)
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error('Özet alınamadı:', err));
  }, []);

  if (!summary) return <p className="text-center mt-10">Yükleniyor...</p>;

  return (
    <div className="p-6 space-y-8">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    <Card title="Müşteriler" value={summary.total_customers} color="bg-blue-500" />
    <Card title="Ürünler" value={summary.total_products} color="bg-green-500" />
    <Card title="Faturalar" value={summary.total_invoices} color="bg-yellow-500" />
    <Card title="Toplam Satış (₺)" value={summary.total_sales.toFixed(2)} color="bg-purple-500" />
  </div>

  <div className="md:col-span-4"> {/* Ekstra garanti için tam genişlik */}
    <Reports />
  </div>
</div>

  );
}

function Card({ title, value, color }) {
  return (
    <div className={`${color} text-white rounded-lg shadow-md p-5`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl mt-2 font-bold">{value}</p>
    </div>
  );
}

export default Dashboard;
