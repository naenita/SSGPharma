'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Search, Loader } from 'lucide-react';

type TabType = 'dashboard' | 'products' | 'molecules' | 'categories' | 'contacts' | 'settings';

interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId?: string;
  manufacturer?: string;
  isActive: boolean;
  pricePaise: number;
  mrpPaise?: number;
  dosage?: string;
  packSize?: string;
  salts?: string;
  description?: string;
  keyBenefits?: string;
  goodToKnow?: string;
  dietType?: string;
  productForm?: string;
  allergiesInformation?: string;
  directionForUse?: string;
  safetyInformation?: string;
  schema?: string;
  specialBenefitSchemes?: string;
  faqs?: string;
  imageUrl1?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string; slug: string };
}

interface Molecule {
  id: string;
  name: string;
  slug: string;
  synonyms?: string;
  imageUrl?: string;
  isPublished: boolean;
  overview?: string;
  backgroundAndApproval?: string;
  uses?: string;
  administration?: string;
  sideEffects?: string;
  warnings?: string;
  precautions?: string;
  expertTips?: string;
  faqs?: string;
  references?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  inquiryType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editingMolecule, setEditingMolecule] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Fetch functions
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        setProducts(await res.json());
        setErrors(prev => ({ ...prev, products: '' }));
      }
    } catch {
      setErrors(prev => ({ ...prev, products: 'Failed to load products' }));
    }
  };

  const fetchMolecules = async () => {
    try {
      const res = await fetch('/api/admin/molecules');
      if (res.ok) {
        setMolecules(await res.json());
        setErrors(prev => ({ ...prev, molecules: '' }));
      }
    } catch {
      setErrors(prev => ({ ...prev, molecules: 'Failed to load molecules' }));
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        setCategories(await res.json());
        setErrors(prev => ({ ...prev, categories: '' }));
      }
    } catch {
      setErrors(prev => ({ ...prev, categories: 'Failed to load categories' }));
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
      if (res.ok) {
        setInquiries(await res.json());
      }
    } catch {
      setErrors(prev => ({ ...prev, inquiries: 'Failed to load inquiries' }));
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMolecules();
    fetchCategories();
    fetchInquiries();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      await fetchProducts();
    } catch {
      setErrors(prev => ({ ...prev, products: 'Delete failed' }));
    }
  };

  const handleDeleteMolecule = async (id: string) => {
    if (!confirm('Delete this molecule?')) return;
    try {
      await fetch(`/api/admin/molecules/${id}`, { method: 'DELETE' });
      await fetchMolecules();
    } catch {
      setErrors(prev => ({ ...prev, molecules: 'Delete failed' }));
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      await fetchCategories();
    } catch {
      setErrors(prev => ({ ...prev, categories: 'Delete failed' }));
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 8 characters' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage(null);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordMessage(null), 3000);
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const PasswordToggle = ({ show, setShow }: { show: boolean; setShow: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => setShow(!show)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto">
            {(['dashboard', 'products', 'molecules', 'categories', 'contacts', 'settings'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveTab(t);
                  setEditingProduct(null);
                  setEditingMolecule(null);
                  setEditingCategory(null);
                }}
                className={`py-4 px-1 font-medium text-sm border-b-2 transition whitespace-nowrap ${
                  activeTab === t
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-sm font-medium">Total Products</p>
                  <p className="text-3xl font-bold text-teal-600 mt-2">{products.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-sm font-medium">Total Molecules</p>
                  <p className="text-3xl font-bold text-teal-600 mt-2">{molecules.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-sm font-medium">Total Categories</p>
                  <p className="text-3xl font-bold text-teal-600 mt-2">{categories.length}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('products')}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition"
                >
                  + Add Product
                </button>
                <button
                  onClick={() => setActiveTab('molecules')}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition"
                >
                  + Add Molecule
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition"
                >
                  + Add Category
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Inquiries</h3>
              {inquiries.length === 0 ? (
                <p className="text-gray-500 text-sm">No inquiries yet</p>
              ) : (
                <div className="space-y-3">
                  {inquiries.slice(0, 10).map(inq => (
                    <div key={inq.id} className="flex justify-between items-start border-b pb-3 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{inq.name}</p>
                        <p className="text-sm text-gray-600">{inq.email}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{inq.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{new Date(inq.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && !editingProduct && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Products</h2>
              <button
                onClick={() => setEditingProduct('new')}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
              >
                + Add Product
              </button>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600"
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>

            {errors.products && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.products}
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Slug</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No products yet
                      </td>
                    </tr>
                  ) : (
                    products
                      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map(p => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                          <td className="px-6 py-4 text-gray-600">{p.slug}</td>
                          <td className="px-6 py-4 text-gray-600">{p.category?.name || '-'}</td>
                          <td className="px-6 py-4 text-gray-600">₹{(p.pricePaise / 100).toFixed(2)}</td>
                          <td className="px-6 py-4 text-center space-x-2">
                            <button
                              onClick={() => setEditingProduct(p.id)}
                              className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-red-600 hover:text-red-700 font-medium text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Molecules Tab */}
        {activeTab === 'molecules' && !editingMolecule && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Molecules</h2>
              <button
                onClick={() => setEditingMolecule('new')}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
              >
                + Add Molecule
              </button>
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search molecules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            </div>

            {errors.molecules && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.molecules}
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Slug</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-900">Published</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {molecules.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No molecules yet
                      </td>
                    </tr>
                  ) : (
                    molecules
                      .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(m => (
                        <tr key={m.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{m.name}</td>
                          <td className="px-6 py-4 text-gray-600">{m.slug}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${m.isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                              {m.isPublished ? '✓ Published' : '○ Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center space-x-2">
                            <button
                              onClick={() => setEditingMolecule(m.id)}
                              className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMolecule(m.id)}
                              className="text-red-600 hover:text-red-700 font-medium text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && !editingCategory && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
              <button
                onClick={() => setEditingCategory('new')}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
              >
                + Add Category
              </button>
            </div>

            {errors.categories && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.categories}
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Slug</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Description</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-900">Active</th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No categories yet
                      </td>
                    </tr>
                  ) : (
                    categories.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                        <td className="px-6 py-4 text-gray-600">{c.slug}</td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs line-clamp-1">{c.description || '-'}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${c.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {c.isActive ? '✓' : '○'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center space-x-2">
                          <button
                            onClick={() => setEditingCategory(c.id)}
                            className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c.id)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Inquiries</h2>

            {errors.inquiries && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.inquiries}
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Phone</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Message</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No inquiries yet
                      </td>
                    </tr>
                  ) : (
                    inquiries.map(inq => (
                      <tr key={inq.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{inq.name}</td>
                        <td className="px-6 py-4 text-gray-600">{inq.email}</td>
                        <td className="px-6 py-4 text-gray-600">{inq.phone || '-'}</td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs line-clamp-2">{inq.message}</td>
                        <td className="px-6 py-4 text-gray-600 text-xs">{inq.inquiryType}</td>
                        <td className="px-6 py-4 text-gray-600 text-xs whitespace-nowrap">{new Date(inq.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>

            <div className="bg-white p-8 rounded-lg border border-gray-200 max-w-md">
              <h3 className="font-semibold text-gray-900 mb-6">Change Password</h3>

              {passwordMessage && (
                <div className={`flex gap-3 p-4 rounded-lg mb-6 ${
                  passwordMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {passwordMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  <span className="text-sm">{passwordMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                      required
                    />
                    <PasswordToggle show={showCurrentPassword} setShow={setShowCurrentPassword} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                      required
                    />
                    <PasswordToggle show={showNewPassword} setShow={setShowNewPassword} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                      required
                    />
                    <PasswordToggle show={showConfirmPassword} setShow={setShowConfirmPassword} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {passwordLoading && <Loader size={18} className="animate-spin" />}
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
