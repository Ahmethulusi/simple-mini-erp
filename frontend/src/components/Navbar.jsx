function Navbar() {
    return (
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-700"></h1>
        <div className="flex items-center space-x-4">
          <button className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-sm">Çıkış</button>
        </div>
      </header>
    );
  }
  
  export default Navbar;
  