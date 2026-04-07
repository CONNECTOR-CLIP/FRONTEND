function SettingModal({ onClose }) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white p-6 rounded-lg shadow-lg w-[400px] h-[200px]"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4">Setting Modal</h2>
          <p>This is a setting modal. Click outside to close.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

export default SettingModal;
