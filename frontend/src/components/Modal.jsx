function Modal({ title, children, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-600">
            ✕
          </button>
          {children}
        </div>
      </div>
    );
  }
  
  export default Modal;
  