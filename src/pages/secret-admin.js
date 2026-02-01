import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function SecretAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories);
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    if (activeTab === 'dashboard') {
      const res = await fetch('/api/admin/secret?type=stats');
      setStats(await res.json());
    } else if (activeTab === 'users') {
      const res = await fetch('/api/admin/secret?type=users');
      setUsers(await res.json());
    } else if (activeTab === 'orders') {
      const res = await fetch('/api/admin/secret?type=orders');
      setOrders(await res.json());
    } else if (activeTab === 'products') {
      const res = await fetch('/api/admin/secret?type=products');
      setProducts(await res.json());
    }
    
    setLoading(false);
  };

  const handleAction = async (action, data) => {
    await fetch('/api/admin/secret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, data })
    });
    loadData();
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      category_id: parseInt(formData.get('category_id')),
      image_url: formData.get('image_url'),
      featured: formData.get('featured') === 'on'
    };

    if (editProduct) {
      data.id = editProduct.id;
      await handleAction('update-product', data);
    } else {
      await handleAction('add-product', data);
    }

    setShowProductModal(false);
    setEditProduct(null);
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'orders', name: 'Orders', icon: '📦' },
    { id: 'products', name: 'Products', icon: '🎸' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <>
      <Head>
        <title>Secret Admin Panel - Melodic</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Warning Banner */}
        <div className="bg-red-600 text-white text-center py-2 text-sm font-medium">
          ⚠️ SECRET ADMIN PANEL - NO AUTHENTICATION REQUIRED ⚠️
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-secondary-900 min-h-screen p-4">
            <div className="flex items-center space-x-2 mb-8 px-2">
              <svg className="w-8 h-8 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              <span className="text-xl font-display font-bold text-white">Admin</span>
            </div>

            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'text-secondary-300 hover:bg-secondary-800'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
              </div>
            ) : (
              <>
                {/* Dashboard */}
                {activeTab === 'dashboard' && stats && (
                  <div>
                    <h1 className="text-2xl font-bold text-secondary-900 mb-8">Dashboard</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-secondary-500 text-sm">Total Users</p>
                        <p className="text-3xl font-bold text-secondary-900 mt-1">{stats.totalUsers}</p>
                      </div>
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-secondary-500 text-sm">Total Orders</p>
                        <p className="text-3xl font-bold text-secondary-900 mt-1">{stats.totalOrders}</p>
                      </div>
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-secondary-500 text-sm">Total Revenue</p>
                        <p className="text-3xl font-bold text-secondary-900 mt-1">${stats.totalRevenue?.toLocaleString() || 0}</p>
                      </div>
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-secondary-500 text-sm">Total Products</p>
                        <p className="text-3xl font-bold text-secondary-900 mt-1">{stats.totalProducts}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-lg font-semibold text-secondary-900 mb-4">Recent Orders</h2>
                      <div className="space-y-4">
                        {stats.recentOrders?.map(order => (
                          <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div>
                              <p className="font-medium text-secondary-900">Order #{order.id}</p>
                              <p className="text-sm text-secondary-500">{order.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-secondary-900">${order.total?.toLocaleString()}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Users */}
                {activeTab === 'users' && (
                  <div>
                    <h1 className="text-2xl font-bold text-secondary-900 mb-8">Users</h1>
                    
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Admin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {users.map(user => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 text-sm text-secondary-900">{user.id}</td>
                              <td className="px-6 py-4 text-sm text-secondary-900">{user.email}</td>
                              <td className="px-6 py-4 text-sm text-secondary-900">{user.first_name} {user.last_name}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${user.is_admin ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                  {user.is_admin ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="px-6 py-4 space-x-2">
                                <button
                                  onClick={() => handleAction('toggle-admin', { userId: user.id })}
                                  className="text-primary-600 hover:underline text-sm"
                                >
                                  Toggle Admin
                                </button>
                                <button
                                  onClick={() => handleAction('delete-user', { userId: user.id })}
                                  className="text-red-600 hover:underline text-sm"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Orders */}
                {activeTab === 'orders' && (
                  <div>
                    <h1 className="text-2xl font-bold text-secondary-900 mb-8">Orders</h1>
                    
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {orders.map(order => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 text-sm text-secondary-900">#{order.id}</td>
                              <td className="px-6 py-4 text-sm text-secondary-900">{order.user_email || 'Guest'}</td>
                              <td className="px-6 py-4 text-sm font-medium text-secondary-900">${order.total?.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-secondary-500">
                                {new Date(order.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleAction('update-order-status', { orderId: order.id, status: e.target.value })}
                                  className="text-sm border border-gray-300 rounded px-2 py-1"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Products */}
                {activeTab === 'products' && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h1 className="text-2xl font-bold text-secondary-900">Products</h1>
                      <button
                        onClick={() => { setEditProduct(null); setShowProductModal(true); }}
                        className="btn-primary"
                      >
                        Add Product
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Featured</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {products.map(product => (
                            <tr key={product.id}>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img src={product.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                                  <div>
                                    <p className="font-medium text-secondary-900">{product.name}</p>
                                    <p className="text-xs text-secondary-500">{product.slug}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-secondary-900">${product.price?.toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm text-secondary-900">{product.stock}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${product.featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                  {product.featured ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="px-6 py-4 space-x-2">
                                <button
                                  onClick={() => { setEditProduct(product); setShowProductModal(true); }}
                                  className="text-primary-600 hover:underline text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleAction('delete-product', { productId: product.id })}
                                  className="text-red-600 hover:underline text-sm"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto p-6">
              <h2 className="text-xl font-bold text-secondary-900 mb-6">
                {editProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Name</label>
                  <input name="name" defaultValue={editProduct?.name} required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Slug</label>
                  <input name="slug" defaultValue={editProduct?.slug} required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Description</label>
                  <textarea name="description" defaultValue={editProduct?.description} rows={3} className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Price</label>
                    <input name="price" type="number" step="0.01" defaultValue={editProduct?.price} required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">Stock</label>
                    <input name="stock" type="number" defaultValue={editProduct?.stock || 0} required className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Category</label>
                  <select name="category_id" defaultValue={editProduct?.category_id} className="input-field">
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Image URL</label>
                  <input name="image_url" defaultValue={editProduct?.image_url} className="input-field" />
                </div>
                <div className="flex items-center gap-2">
                  <input name="featured" type="checkbox" defaultChecked={editProduct?.featured} id="featured" />
                  <label htmlFor="featured" className="text-sm text-secondary-700">Featured Product</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editProduct ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={() => setShowProductModal(false)} className="btn-outline flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
