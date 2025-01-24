import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

const INITIAL_ITEMS = [
  { id: 1, name: 'Laptop', category: 'Electronics', quantity: 15, price: 999 },
  { id: 2, name: 'Desk Chair', category: 'Furniture', quantity: 8, price: 199 },
  { id: 3, name: 'Coffee Maker', category: 'Appliances', quantity: 12, price: 79},
  { id: 4, name: 'Wireless Mouse', category: 'Electronics', quantity: 25, price: 29},
];

const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Appliances'];

function App() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Electronics',
    quantity: '',
    price: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Memoized filtered and sorted items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];   //Initail items
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [items, selectedCategory, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity || !newItem.price) return;
    
    setItems(prev => [...prev, {
      id: Date.now(),
      ...newItem,
      quantity: parseInt(newItem.quantity),
      price: parseFloat(newItem.price)
    }]);
    
    setNewItem({ name: '', category: 'Electronics', quantity: '', price: '' });
    setShowAddForm(false);
  };

  const handleEditItem = (item) => {
    setEditingItem({ ...item });
  };

  const handleSaveEdit = () => {
    setItems(prev => prev.map(item => 
      item.id === editingItem.id ? editingItem : item
    ));
    setEditingItem(null);
  };

  const handleDeleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-lg shadow-lg p-6">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">

            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>

            <div className="flex gap-4 flex-wrap">

              <select className="px-3 py-2 border rounded-md" value={selectedCategory}
                     onChange={(e) => setSelectedCategory(e.target.value)} >

                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}

              </select>

              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} /> Add Item
              </button>
              
            </div>

          </div>

          {/* Add Item Form */}
          {showAddForm && (

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">

              <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  className="px-3 py-2 border rounded-md"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                />
                <select
                  className="px-3 py-2 border rounded-md"
                  value={newItem.category}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                >
                  {CATEGORIES.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Quantity"
                  className="px-3 py-2 border rounded-md"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  className="px-3 py-2 border rounded-md"
                  value={newItem.price}
                  onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort('name')}
                    >
                      Name
                      {sortConfig.key === 'name' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort('quantity')}
                    >
                      Quantity
                      {sortConfig.key === 'quantity' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort('price')}
                    >
                      Price
                      {sortConfig.key === 'price' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">

                {filteredAndSortedItems.map(item => (
                  <tr
                    key={item.id}
                    className={item.quantity < 10 ? 'bg-red-100' : ''}
                  >
                    {editingItem?.id === item.id ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            className="px-2 py-1 border rounded-md w-full"
                            value={editingItem.name}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            className="px-2 py-1 border rounded-md w-full"
                            value={editingItem.category}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, category: e.target.value }))}
                          >
                            {CATEGORIES.slice(1).map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            className="px-2 py-1 border rounded-md w-full"
                            value={editingItem.quantity}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            step="0.01"
                            className="px-2 py-1 border rounded-md w-full"
                            value={editingItem.price}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Save size={20} />
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">{item.name}</td>
                        <td className="px-6 py-4">{item.category}</td>
                        <td className="px-6 py-4">{item.quantity}</td>
                        <td className="px-6 py-4">₹ {item.price}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}

                  </tr>
                ))}

              </tbody>
              
            </table>

          </div>

        </div>

      </div>
      
    </div>
  );
}

export default App;