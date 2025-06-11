import { useEffect, useState } from 'react';
import Modal from "../components/Modal.jsx";
import { Link } from "react-router-dom";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    customer_type: ''
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/customers')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.error('Cariler alınamadı:', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const newCustomer = await res.json();
    setCustomers([...customers, newCustomer]);
    setForm({ name: '', email: '', phone: '', address: '', customer_type: '' });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu cariyi silmek istiyor musun?")) return;

    fetch(`http://localhost:3001/api/customers/${id}`, { method: 'DELETE' })
      .then(() => setCustomers(customers.filter(c => c.id !== id)))
      .catch(err => console.error("Silme hatası:", err));
  };

  const handleUpdate = (customer) => {
    setEditingCustomer(customer);
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👥 Cariler</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-8 flex flex-wrap gap-4 items-end">
        <input
          type="text"
          name="name"
          placeholder="Ad Soyad"
          value={form.name}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="E-posta"
          value={form.email}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefon"
          value={form.phone}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Adres"
          value={form.address}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <select
          name="customer_type"
          value={form.customer_type}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        >
          <option value="">Müşteri Türü</option>
          <option value="NORMAL">Normal</option>
          <option value="VIP">VIP</option>
          <option value="STUDENT">Öğrenci</option>
          <option value="CORPORATE">Şirket</option>
        </select>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Cari Ekle
        </button>
      </form>

      {/* TABLO */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 text-left">Adı</th>
              <th className="py-2 px-4 text-left">Tip</th>
              <th className="py-2 px-4 text-left">E-posta</th>
              <th className="py-2 px-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-t">
              <td className="py-2 px-4">
                <Link
                  to={`/customers/${c.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {c.name}
                </Link>
              </td>
                <td className="py-2 px-4">{c.customer_type}</td>
                <td className="py-2 px-4">{c.email}</td>
                <td className="py-2 px-4 text-right space-x-2">
                  <button
                    onClick={() => handleUpdate(c)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Güncelle
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">Hiç cari yok...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>{editingCustomer && (
      <Modal
        title="Cariyi Güncelle"
        onClose={() => setEditingCustomer(null)}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await fetch(`http://localhost:3001/api/customers/${editingCustomer.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(editingCustomer)
            });
            const updated = await res.json();
            setCustomers(customers.map(c => (c.id === updated.id ? updated : c)));
            setEditingCustomer(null);
          }}
          className="space-y-3"
        >
          <input
            type="text"
            value={editingCustomer.name}
            onChange={e => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            value={editingCustomer.email}
            onChange={e => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={editingCustomer.phone}
            onChange={e => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={editingCustomer.address}
            onChange={e => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <select
            value={editingCustomer.customer_type}
            onChange={e => setEditingCustomer({ ...editingCustomer, customer_type: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="NORMAL">NORMAL</option>
            <option value="VIP">VIP</option>
          </select>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full">
            Güncelle
          </button>
        </form>
      </Modal>
    )}

    </div>
  );
}



export default Customers;
