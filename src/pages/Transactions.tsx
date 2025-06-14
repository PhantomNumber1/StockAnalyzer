import React from 'react';
import { useUser } from '../contexts/UserContext';
import { ArrowUpCircle, ArrowDownCircle, PlusCircle, Clock } from 'lucide-react';
const Transactions = () => {
  const {
    transactions
  } = useUser();
  // Format currency in Indian format
  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  return <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Transaction History
      </h1>
      {transactions.length > 0 ? <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left">Date & Time</th>
                  <th className="py-3 px-6 text-left">Type</th>
                  <th className="py-3 px-6 text-left">Details</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map(transaction => <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-gray-500">
                      {formatDate(transaction.timestamp)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {transaction.type === 'BUY' ? <ArrowDownCircle className="w-5 h-5 mr-2 text-blue-600" /> : transaction.type === 'SELL' ? <ArrowUpCircle className="w-5 h-5 mr-2 text-green-600" /> : <PlusCircle className="w-5 h-5 mr-2 text-purple-600" />}
                        <span className={transaction.type === 'BUY' ? 'text-blue-600' : transaction.type === 'SELL' ? 'text-green-600' : 'text-purple-600'}>
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {transaction.type === 'BUY' && <span>
                          Purchased {transaction.quantity} shares of{' '}
                          {transaction.symbol} at ₹
                          {transaction.price?.toFixed(2)}
                        </span>}
                      {transaction.type === 'SELL' && <span>
                          Sold {transaction.quantity} shares of{' '}
                          {transaction.symbol} at ₹
                          {transaction.price?.toFixed(2)}
                        </span>}
                      {transaction.type === 'DEPOSIT' && <span>Added funds to account</span>}
                    </td>
                    <td className={`py-4 px-6 text-right font-medium ${transaction.type === 'BUY' ? 'text-red-600' : 'text-green-600'}`}>
                      {transaction.type === 'BUY' ? '- ' : '+ '}
                      {formatIndianCurrency(transaction.amount)}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div> : <div className="bg-white rounded-lg shadow-sm p-16 text-center">
          <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No Transactions Yet
          </h2>
          <p className="text-gray-500">
            You haven't made any transactions yet. Start trading to see your
            transaction history.
          </p>
        </div>}
    </div>;
};
export default Transactions;