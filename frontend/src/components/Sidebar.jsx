import { NavLink } from 'react-router-dom';

function Sidebar() {
  const linkStyle = ({ isActive }) =>
    `block w-full px-4 py-3 rounded transition text-sm fo nt-medium ${
      isActive
        ? 'bg-blue-100 text-blue-700 font-semibold'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-5 text-xl font-bold text-gray-800 border-b">Admin Panel</div>
      <nav className="p-4 space-y-2">
        <NavLink to="/" className={linkStyle}>🏠 Dashboard</NavLink> 
        <NavLink to="/products" className={linkStyle}>📦 Ürünler</NavLink>
        <NavLink to="/customers" className={linkStyle}>👥 Cariler</NavLink>
        <NavLink to="/invoices" className={linkStyle}>🧾 Faturalar</NavLink>
        <NavLink to="/reports" className={linkStyle}>📊 Raporlar</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
