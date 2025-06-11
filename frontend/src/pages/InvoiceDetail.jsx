import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function InvoiceDetail() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product_id: '', quantity: 1 });
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [itemsRes, productsRes, invoiceRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/invoices/${id}/items`),
        fetch(`${process.env.REACT_APP_API_URL}/api/products`),
        fetch(`${process.env.REACT_APP_API_URL}/api/invoices/${id}`)
      ]);
  
      const itemsData = await itemsRes.json();
      const productsData = await productsRes.json();
      const invoiceData = await invoiceRes.json();
  
      // Şimdi sıralı ve güvenli şekilde set ediliyor
      setInvoice(invoiceData);
      setProducts(productsData);
      setItems(itemsData);
    };
  
    fetchData();
  }, [id]);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/invoices/${id}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: parseInt(form.product_id),
        quantity: parseInt(form.quantity)
      })
    });

    const { item, invoice: updatedInvoice } = await res.json();

    const matchedProduct = products.find(p => p.id === item.product_id);
    if (matchedProduct) {
      item.product_name = matchedProduct.name;
    }

    setItems([...items, item]);
    setInvoice(updatedInvoice);
    setForm({ product_id: '', quantity: 1 });
  };
  const totalAmount = invoice?.total_amount;
  const totalVat = invoice?.total_vat;
  const discount = invoice?.discount_applied;
  const final = invoice?.final_amount;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🧾 Fatura #{id} Detayı</h2>

      <form onSubmit={handleAdd} className="flex gap-4 items-end mb-6">
        <select
          name="product_id"
          value={form.product_id}
          onChange={handleChange}
          required
          className="p-2 border rounded"
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
          value={form.quantity}
          onChange={handleChange}
          required
          className="p-2 border rounded w-24"
        />
        <input
          type="text"
          value={
            form.product_id
              ? `${products.find(p => p.id === parseInt(form.product_id))?.vat_rate || 0} %`
              : ''
          }
          disabled
          className="p-2 border rounded w-24 bg-gray-100 text-center text-sm text-gray-600"
          placeholder="KDV"
        />
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Ekle
        </button>
      </form>

      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-2 px-4 text-left">Ürün</th>
            <th className="py-2 px-4 text-left">Stok Miktarı</th>
            <th className="py-2 px-4 text-left">Birim Fiyat</th>
            <th className="py-2 px-4 text-left">Toplam</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-t">
              <td className="py-2 px-4">{item.product_name || item.product_id}</td>
              <td className="py-2 px-4">
              {item.quantity} {products.find(p => p.id === item.product_id)?.unit || ''}
            </td>
              <td className="py-2 px-4">{item.unit_price}</td>
              <td className="py-2 px-4">{item.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {invoice && (
  <div className="mt-6 text-right space-y-1 text-sm text-gray-700">
    <div>Ara Toplam: {totalAmount ?? ''} ₺</div>
    <div>İndirim: - {discount ?? ''} ₺</div>
    <div>KDV: + {totalVat ?? ''} ₺</div>

    <div className="text-lg font-bold text-gray-900">
    <div>Genel Toplam: {final ? parseFloat(final).toFixed(2) : ''} ₺</div>
    </div>
  </div>
)}

    </div>
  );
}

export default InvoiceDetail;
