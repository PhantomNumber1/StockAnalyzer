import React, { useState } from 'react';
import { useStocks } from '../contexts/StockContext';
import { PlusCircle, Edit2, Trash2, RefreshCw } from 'lucide-react';
const AdminPanel = () => {
  const {
    stocks,
    addStock,
    updateStock,
    deleteStock,
    simulateMarketMovement
  } = useStocks();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStock, setCurrentStock] = useState<any>(null);
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    currentPrice: 0,
    previousClose: 0,
    high: 0,
    low: 0,
    volume: 0,
    marketCap: 0,
    sector: ''
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'symbol' || name === 'name' || name === 'sector' ? value : Number(value)
    }));
  };
  const handleAddNew = () => {
    setIsAdding(true);
    setIsEditing(false);
    setFormData({
      symbol: '',
      name: '',
      currentPrice: 0,
      previousClose: 0,
      high: 0,
      low: 0,
      volume: 0,
      marketCap: 0,
      sector: ''
    });
  };
  const handleEdit = (stock: any) => {
    setIsEditing(true);
    setIsAdding(false);
    setCurrentStock(stock);
    setFormData({
      symbol: stock.symbol,
      name: stock.name,
      currentPrice: stock.currentPrice,
      previousClose: stock.previousClose,
      high: stock.high,
      low: stock.low,
      volume: stock.volume,
      marketCap: stock.marketCap,
      sector: stock.sector
    });
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this stock?')) {
      deleteStock(id);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdding) {
      addStock(formData);
      setIsAdding(false);
    } else if (isEditing && currentStock) {
      updateStock(currentStock.id, formData);
      setIsEditing(false);
      setCurrentStock(null);
    }
    setFormData({
      symbol: '',
      name: '',
      currentPrice: 0,
      previousClose: 0,
      high: 0,
      low: 0,
      volume: 0,
      marketCap: 0,
      sector: ''
    });
  };
  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentStock(null);
    setFormData({
      symbol: '',
      name: '',
      currentPrice: 0,
      previousClose: 0,
      high: 0,
      low: 0,
      volume: 0,
      marketCap: 0,
      sector: ''
    });
  };
  // Format currency in Indian format
  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  return <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <div className="flex space-x-4">
          <button onClick={simulateMarketMovement} className="flex items-center py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <RefreshCw className="w-4 h-4 mr-2" />
            Simulate Market Movement
          </button>
          <button onClick={handleAddNew} className="flex items-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Stock
          </button>
        </div>
      </div>
      {(isAdding || isEditing) && <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {isAdding ? 'Add New Stock' : 'Edit Stock'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="symbol" className="block text-gray-700 font-medium mb-2">
                  Symbol
                </label>
                <input id="symbol" name="symbol" type="text" value={formData.symbol} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Company Name
                </label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label htmlFor="currentPrice" className="block text-gray-700 font-medium mb-2">
                  Current Price (₹)
                </label>
                <input id="currentPrice" name="currentPrice" type="number" step="0.01" value={formData.currentPrice} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="previousClose" className="block text-gray-700 font-medium mb-2">
                  Previous Close (₹)
                </label>
                <input id="previousClose" name="previousClose" type="number" step="0.01" value={formData.previousClose} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="sector" className="block text-gray-700 font-medium mb-2">
                  Sector
                </label>
                <input id="sector" name="sector" type="text" value={formData.sector} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <label htmlFor="high" className="block text-gray-700 font-medium mb-2">
                  Day's High (₹)
                </label>
                <input id="high" name="high" type="number" step="0.01" value={formData.high} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="low" className="block text-gray-700 font-medium mb-2">
                  Day's Low (₹)
                </label>
                <input id="low" name="low" type="number" step="0.01" value={formData.low} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="volume" className="block text-gray-700 font-medium mb-2">
                  Volume
                </label>
                <input id="volume" name="volume" type="number" value={formData.volume} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="marketCap" className="block text-gray-700 font-medium mb-2">
                  Market Cap (₹)
                </label>
                <input id="marketCap" name="marketCap" type="number" value={formData.marketCap} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={handleCancel} className="py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Cancel
              </button>
              <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {isAdding ? 'Add Stock' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Manage Stocks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-6 text-left">Symbol</th>
                <th className="py-3 px-6 text-left">Company</th>
                <th className="py-3 px-6 text-left">Sector</th>
                <th className="py-3 px-6 text-right">Price</th>
                <th className="py-3 px-6 text-right">Market Cap</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stocks.map(stock => <tr key={stock.id}>
                  <td className="py-4 px-6 font-medium">{stock.symbol}</td>
                  <td className="py-4 px-6">{stock.name}</td>
                  <td className="py-4 px-6">{stock.sector}</td>
                  <td className="py-4 px-6 text-right">
                    ₹{stock.currentPrice.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {formatIndianCurrency(stock.marketCap)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center space-x-3">
                      <button onClick={() => handleEdit(stock)} className="text-blue-600 hover:text-blue-800">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(stock.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export default AdminPanel;