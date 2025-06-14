import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStocks } from '../contexts/StockContext';
import { useUser } from '../contexts/UserContext';
import { PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
const Portfolio = () => {
  const {
    stocks
  } = useStocks();
  const {
    balance,
    holdings,
    updateHoldings,
    addFunds
  } = useUser();
  const navigate = useNavigate();
  const [totalValue, setTotalValue] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);
  const [addAmount, setAddAmount] = useState(100000); // Default ₹1,00,000
  useEffect(() => {
    if (stocks.length > 0 && holdings.length > 0) {
      updateHoldings(stocks);
      const totalCurrentValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
      const totalInvested = holdings.reduce((sum, holding) => sum + holding.averageBuyPrice * holding.quantity, 0);
      setTotalValue(totalCurrentValue);
      setTotalInvestment(totalInvested);
      setProfitLoss(totalCurrentValue - totalInvested);
    } else {
      setTotalValue(0);
      setTotalInvestment(0);
      setProfitLoss(0);
    }
  }, [stocks, holdings, updateHoldings]);
  const handleStockClick = (stockId: string) => {
    navigate(`/stock/${stockId}`);
  };
  const handleAddFunds = () => {
    if (addAmount > 0) {
      addFunds(addAmount);
    }
  };
  // Format currency in Indian format
  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  // Calculate portfolio allocation for pie chart
  const portfolioAllocation = holdings.map(holding => ({
    name: holding.symbol,
    value: holding.currentValue
  }));
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#BDBDBD', '#A4DE6C'];
  return <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Portfolio</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Portfolio Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Portfolio Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold">
                {formatIndianCurrency(balance)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Portfolio Value</p>
              <p className="text-2xl font-bold">
                {formatIndianCurrency(totalValue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Assets</p>
              <p className="text-2xl font-bold">
                {formatIndianCurrency(balance + totalValue)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Total Investment</p>
              <p className="text-2xl font-bold">
                {formatIndianCurrency(totalInvestment)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Profit/Loss</p>
              <div className={`flex items-center ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitLoss >= 0 ? <ArrowUpRight className="w-5 h-5 mr-1" /> : <ArrowDownRight className="w-5 h-5 mr-1" />}
                <span className="text-2xl font-bold">
                  {formatIndianCurrency(Math.abs(profitLoss))}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Return</p>
              <div className={`flex items-center ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitLoss >= 0 ? <ArrowUpRight className="w-5 h-5 mr-1" /> : <ArrowDownRight className="w-5 h-5 mr-1" />}
                <span className="text-2xl font-bold">
                  {totalInvestment > 0 ? `${(profitLoss / totalInvestment * 100).toFixed(2)}%` : '0.00%'}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Add Funds */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add Funds</h2>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
              Amount (₹)
            </label>
            <input id="amount" type="number" min="1000" step="1000" value={addAmount} onChange={e => setAddAmount(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={handleAddFunds} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Add Funds
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Note: This is a mock platform. No real money is involved.
          </p>
        </div>
      </div>
      {/* Portfolio Allocation */}
      {holdings.length > 0 ? <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Portfolio Allocation
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={portfolioAllocation} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({
                name,
                percent
              }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {portfolioAllocation.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={value => [formatIndianCurrency(value as number), 'Value']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Holdings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="py-3 px-6 text-left">Stock</th>
                    <th className="py-3 px-6 text-right">Quantity</th>
                    <th className="py-3 px-6 text-right">Avg. Buy Price</th>
                    <th className="py-3 px-6 text-right">Current Price</th>
                    <th className="py-3 px-6 text-right">Value</th>
                    <th className="py-3 px-6 text-right">Profit/Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {holdings.map(holding => {
                const stock = stocks.find(s => s.id === holding.stockId);
                if (!stock) return null;
                const profitLoss = holding.currentValue - holding.averageBuyPrice * holding.quantity;
                const profitLossPercent = (stock.currentPrice / holding.averageBuyPrice - 1) * 100;
                return <tr key={holding.stockId} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleStockClick(holding.stockId)}>
                        <td className="py-4 px-6 font-medium">
                          {holding.symbol}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {holding.quantity}
                        </td>
                        <td className="py-4 px-6 text-right">
                          ₹{holding.averageBuyPrice.toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          ₹{stock.currentPrice.toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {formatIndianCurrency(holding.currentValue)}
                        </td>
                        <td className={`py-4 px-6 text-right ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          <div className="flex items-center justify-end">
                            {profitLoss >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                            {formatIndianCurrency(Math.abs(profitLoss))} (
                            {profitLossPercent.toFixed(2)}%)
                          </div>
                        </td>
                      </tr>;
              })}
                </tbody>
              </table>
            </div>
          </div>
        </div> : <div className="bg-white rounded-lg shadow-sm p-16 text-center mb-8">
          <PieChartIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No Holdings Yet
          </h2>
          <p className="text-gray-500 mb-6">
            You haven't purchased any stocks yet. Visit the market dashboard to
            start trading.
          </p>
          <button onClick={() => navigate('/dashboard')} className="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Go to Dashboard
          </button>
        </div>}
    </div>;
};
export default Portfolio;