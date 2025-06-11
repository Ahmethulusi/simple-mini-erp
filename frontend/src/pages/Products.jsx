import { useEffect, useState } from 'react';
import Modal from "../components/Modal.jsx";


function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    unit: '',
    vat_rate: ''
  });
  

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Ürünler alınamadı:', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        stock_quantity: parseInt(form.stock_quantity),
        vat_rate: parseFloat(form.vat_rate)
      })
      
      
    });

    const newProduct = await res.json();
    setProducts([...products, newProduct]);
    setForm({ name: '', description: '', price: '', stock_quantity: '' });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Silmek istediğine emin misin?")) return;

    fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`, { method: 'DELETE' })
      .then(() => setProducts(products.filter(p => p.id !== id)))
      .catch(err => console.error("Silme hatası:", err));
  };

  const handleUpdate = (product) => {
    setEditingProduct(product);
  };
  
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      // Arama kutusu boşsa tüm ürünleri getir
      fetch(`${process.env.REACT_APP_API_URL}/api/products`)
        .then(res => res.json())
        .then(data => setProducts(data));
      return;
    }
  
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProducts(filtered);
  };
  

  return (
    
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Ürünler</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-8 flex flex-wrap gap-4 items-end">

      <input
        type="text"
        name="name"
        placeholder="Ürün Adı"
        value={form.name}
        onChange={handleChange}
        required
        className="p-2 border rounded"
      />
      <input
        type="text"
        name="description"
        placeholder="Açıklama"
        value={form.description}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <input
        type="number"
        name="price"
        placeholder="Fiyat"
        value={form.price}
        onChange={handleChange}
        required
        className="p-2 border rounded"
      />
      <input
        type="number"
        name="stock_quantity"
        placeholder="Stok"
        value={form.stock_quantity}
        onChange={handleChange}
        required
        className="p-2 border rounded"
      />
      <select
        name="unit"
        value={form.unit || ''}
        onChange={handleChange}
        required
        className="p-2 border rounded"
      >
        <option value="">Birim Seç</option>
        <option value="Adet">Adet</option>
        <option value="Kg">Kg</option>
        <option value="Litre">Litre</option>
      </select>
      <select
        name="vat_rate"
        value={form.vat_rate || ''}
        onChange={handleChange}
        required
        className="p-2 border rounded"
      >
        <option value="">KDV (%)</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="10">10</option>
        <option value="20">20</option>
        
      </select>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Ürün Ekle
        </button>

        <input
          type="text"
          placeholder="Ürün ara..."
          onChange={(e) => handleSearch(e.target.value)}
          className="p-2 border rounded"
        />
      </div>




    </form>


      {/* LİSTE */}
      <div className="overflow-y-auto max-h-[400px]">
        <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-400 text-white">
        <tr>
          <th className="py-2 px-4 text-left sticky top-0 bg-gray-500 z-10">Ürün Adı</th>
          <th className="py-2 px-4 text-left sticky top-0 bg-gray-500 z-10">Fiyat (₺)</th>
          <th className="py-2 px-4 text-left sticky top-0 bg-gray-500 z-10">Stok</th>
          <th className="py-2 px-4 text-left sticky top-0 bg-gray-500 z-10">Birim</th>
          <th className="py-2 px-4 text-left sticky top-0 bg-gray-500 z-10">KDV (%)</th>
          <th className="py-2 px-4 text-left sticky top-0 bg-gray-500 z-10">İşlem</th>
        </tr>
      </thead>

      <tbody>
      {products.map(p => (
        <tr key={p.id} className="border-t">
          <td className="py-2 px-4">{p.name}</td>
          <td className="py-2 px-4">{p.price}</td>
          <td className="py-2 px-4">{p.stock_quantity}</td>
          <td className="py-2 px-4">{p.unit}</td>
          <td className="py-2 px-4">{p.vat_rate}</td>
          <td className="py-2 px-4 text-right space-x-2">
            <button
              onClick={() => handleUpdate(p)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Güncelle
            </button>
            <button
              onClick={() => handleDelete(p.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Sil
            </button>
          </td>
        </tr>
      ))}
    </tbody>

        </table>
      </div>
      {editingProduct && (
  <Modal
    title="Ürünü Güncelle"
    onClose={() => setEditingProduct(null)}
  >
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:3001/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct)
        });
        const updated = await res.json();
        setProducts(products.map(p => (p.id === updated.id ? updated : p)));
        setEditingProduct(null);
      }}
      className="space-y-3"
    >
      <input
        type="text"
        value={editingProduct.name}
        onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={editingProduct.description}
        onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        value={editingProduct.price}
        onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        value={editingProduct.stock_quantity}
        onChange={e => setEditingProduct({ ...editingProduct, stock_quantity: parseInt(e.target.value) })}
        className="w-full p-2 border rounded"
      />
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full">
        Güncelle
      </button>
    </form>
  </Modal>
)}

    </div>

    
  );
}

export default Products;
