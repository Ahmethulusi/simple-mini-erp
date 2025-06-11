import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <p>Yükleniyor...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">🧾 Ürün Detayı: {product.name}</h2>

      <div className="bg-gray-100 rounded p-4">
        <p><strong>Açıklama:</strong> {product.description}</p>
        <p><strong>Fiyat:</strong> {product.price} ₺</p>
        <p><strong>Birim:</strong> {product.unit}</p>
        <p><strong>Stok:</strong> {product.stock_quantity}</p>
        <p><strong>KDV:</strong> %{product.vat_rate}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">📊 Ürünle İlgili Hareketler</h3>
        <p className="text-sm italic text-gray-500">
          (Bu kısma fatura geçmişi, toplam satış adedi gibi detaylar eklenecek.)
        </p>
      </div>
    </div>
  );
}

export default ProductDetail;
