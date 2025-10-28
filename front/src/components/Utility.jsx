import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaFileExcel, FaFileUpload, FaTrash, FaGamepad } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const appURL = import.meta.env.VITE_APP_URL;

const Utility = () => {
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showGame, setShowGame] = useState(false);

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload only .xlsx or .csv files');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const isValid = jsonData.every(row =>
          row.title && row.author && row.quantity &&
          typeof row.quantity === 'number'
        );

        if (!isValid) {
          toast.error('Invalid data format in file');
          return;
        }

        const response = await fetch(`${appURL}/api/v1/books/bulk-import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ books: jsonData })
        });

        if (response.ok) {
          toast.success('Books imported successfully');
        } else {
          throw new Error('Import failed');
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast.error('Error importing file');
    }
  };

  const MemoryGame = () => {
  const generateCards = () => {
    return [...Array(8).fill().map((_, i) => ({ id: i, value: i, flipped: false })),
            ...Array(8).fill().map((_, i) => ({ id: i + 8, value: i, flipped: false }))]
      .sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState(generateCards());
  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardClick = (index) => {
    if (selectedCards.length === 2 || cards[index].flipped) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setSelectedCards([...selectedCards, index]);

    if (selectedCards.length === 1) {
      setTimeout(() => {
        checkMatch(selectedCards[0], index);
      }, 700);
    }
  };

  const checkMatch = (first, second) => {
    const newCards = [...cards];
    if (cards[first].value === cards[second].value) {
      toast.success('Match found!');
    } else {
      newCards[first].flipped = false;
      newCards[second].flipped = false;
    }
    setCards(newCards);
    setSelectedCards([]);
  };

  const resetGame = () => {
    setCards(generateCards());
    setSelectedCards([]);
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`h-20 w-20 rounded-lg font-bold text-xl transition duration-200 flex items-center justify-center ${
              card.flipped
                ? 'bg-gradient-to-br from-blue-600 to-black text-white'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {card.flipped ? card.value : '?'}
          </button>
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-black text-white rounded-lg hover:shadow-md transition"
        >
          🔁 Reset Game
        </button>
      </div>
    </div>
  );
};


  return (
  <div className="p-6 min-h-screen bg-[#f6f7f9]">
    <h2 className="text-3xl font-bold mb-8 text-black">Utilities</h2>

      {/* Utilities Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Import Books */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-4 text-black">Import Books</h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg cursor-pointer hover:shadow-[0_0_8px_2px_rgba(0,120,255,0.5)] transition">
              <FaFileUpload />
              <span>Select File</span>
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.csv"
                onChange={handleFileImport}
              />
            </label>
            <span className="text-sm text-gray-500">Supported: .xlsx, .csv</span>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-4 text-black">Account Management</h3>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:shadow-[0_0_8px_2px_rgba(0,120,255,0.5)] transition"
          >
            <FaTrash />
            Delete Account
          </button>
        </div>

        {/* Game Toggle */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-4 text-black">Bored?</h3>
          <button
            onClick={() => setShowGame(!showGame)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:shadow-[0_0_8px_2px_rgba(0,120,255,0.5)] transition"
          >
            <FaGamepad />
            Play Memory Game
          </button>
        </div>

        {/* Quick Tip */}
        <div className="bg-gradient-to-br from-black to-gray-900 text-white rounded-xl shadow-md p-6 md:col-span-2 xl:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">💡 Quick Tip</h3>
            <p className="text-sm text-gray-300">
              Bulk imports are faster with well-formatted .csv files. Use headers like: title, author, quantity.
            </p>
          </div>
          <div className="mt-6 text-right text-xs text-gray-400 italic">Last updated: Sep 2025</div>
        </div>
      </div>

      {/* Memory Game Section */}
      {showGame && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-black mb-4">🧠 Memory Game</h3>
          <MemoryGame />
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-black">Delete Account?</h3>
            <p className="mb-6 text-gray-600">This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/v1/user/delete-account', {
                      method: 'DELETE'
                    });
                    if (response.ok) {
                      toast.success('Account deleted successfully');
                    }
                  } catch (error) {
                    toast.error('Failed to delete account');
                  }
                }}
                className="px-4 py-2 bg-black text-white rounded hover:shadow-[0_0_8px_2px_rgba(0,120,255,0.5)] transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default Utility;
