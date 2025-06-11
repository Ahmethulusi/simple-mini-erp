import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Invoices() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);
  const [form, setForm] = useState({ customer_id: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/invoices`)
      .then(res => res.json())
      .then(data => setInvoices(data));

    fetch(`${process.env.REACT_APP_API_URL}/api/customers`)
      .then(res => res.json())
      .then(data => setCustomers(data));

    fetch(`${process.env.REACT_APP_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, e) => {
    const newItems = [...items];
    newItems[index][e.target.name] = e.target.value;
    setItems(newItems);
  };

  const addItemField = () => {
    setItems([...items, { product_id: '', quantity: 1 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: form.customer_id, items })
    });
    const result = await res.json();
    const matchedCustomer = customers.find(c => c.id === result.customer_id);
    result.customer_name = matchedCustomer?.name || result.customer_id;
    setMessage(`Fatura oluşturuldu. Fatura ID: ${result.id}`);
    setInvoices([...invoices, result]);
    setForm({ customer_id: '' });
    setItems([{ product_id: '', quantity: 1 }]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🧾 Fatura Oluştur</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <select
          name="customer_id"
          value={form.customer_id}
          onChange={handleFormChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Müşteri Seç</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <select
              name="product_id"
              value={item.product_id}
              onChange={e => handleItemChange(index, e)}
              required
              className="w-1/2 p-2 border rounded"
            >
              <option value="">Ürün Seç</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input
              type="number"
              name="quantity"
              min="1"
              placeholder="Adet"
              value={item.quantity}
              onChange={e => handleItemChange(index, e)}
              required
              className="w-1/2 p-2 border rounded"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addItemField}
          className="text-sm text-blue-600 hover:underline"
        >
          + Ürün Ekle
        </button>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Fatura Oluştur
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}

      <h3 className="text-lg font-semibold mt-10 mb-2">📋 Fatura Listesi</h3>
      <div className="overflow-y-auto max-h-[400px]">
        <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-500 text-white">
          <tr>
            <th className="py-2 px-4 text-left sticky top-0 bg-gray-500 z-10">Tarih</th>
            <th className="py-2 px-4 text-left sticky top-0 bg-gray-500 z-10">Fatura ID</th>
            <th className="py-2 px-4 text-left sticky top-0 bg-gray-500 z-10">Müşteri</th>
            <th className="py-2 px-4 text-left sticky top-0 bg-gray-500 z-10">Toplam</th>
            <th className="py-2 px-4 text-left sticky top-0 bg-gray-500 z-10">KDV</th>
            <th className="py-2 px-4 text-left sticky top-0 bg-gray-500 z-10">İndirim</th>
            <th className="py-2 px-4 text-left sticky top-0 bg-gray-500 z-10">Genel Toplam</th>
            <th className="py-2 px-4 text-right sticky top-0 bg-gray-500 z-10">İşlem</th>
          </tr>
        </thead>

          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} className="border-t">
                <td className="py-2 px-4">{inv.created_at?.split('T')[0]}</td>
                <td className="py-2 px-4">{inv.id}</td>
                <td className="py-2 px-4">{inv.customer_name || inv.customer_id}</td>
                <td className="py-2 px-4">{inv.total_amount} ₺</td>
                <td className="py-2 px-4">{inv.total_vat || 0} ₺</td>
                <td className="py-2 px-4 text-red-600">- {inv.discount_applied} ₺</td>
                <td className="py-2 px-4 font-semibold">{inv.final_amount} ₺</td>
                <td className="py-2 px-4 text-right">
                  <Link
                    to={`/invoice/${inv.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Detay
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Invoices;
