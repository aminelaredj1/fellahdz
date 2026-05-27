"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Leaf, Plus, Trash2, Image as ImageIcon, Loader2, CheckCircle2, Pencil, X, Save } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function FarmerDashboard() {
  const t = useTranslations('Farmer');
  const tIndex = useTranslations('Index');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  // Form State
  const [category, setCategory] = useState('');
  const [storageState, setStorageState] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const categories = ['خضر', 'فواكه', 'أغنام', 'مواشي', 'لحوم', 'تمور', 'حبوب وبقوليات', 'ألبان وأجبان', 'أخرى'];
  const storageStates = ['طازجة', 'فريقو/غرف تبريد', 'مجمدة', 'مصنعة'];
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUserAndProducts();
  }, []);

  const fetchUserAndProducts = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Auto-fill phone if available in metadata
        if (user.user_metadata?.phone) {
          setPhone(user.user_metadata.phone);
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('farmer_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('يجب تسجيل الدخول أولاً');
      return;
    }
    setSubmitting(true);

    try {
      let imageUrl = null;

      // 1. Upload Image if provided
      if (imageFile) {
        try {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, imageFile);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('product-images')
              .getPublicUrl(filePath);
            imageUrl = publicUrl;
          } else {
            console.warn('Image upload failed, saving without image:', uploadError.message);
          }
        } catch (imgErr) {
          console.warn('Image upload error, continuing without image:', imgErr);
        }
      }

      // 2. Insert Product
      const { error: insertError } = await supabase
        .from('products')
        .insert({
          farmer_id: user.id,
          category,
          storage_state: storageState,
          name,
          price: parseFloat(price),
          quantity,
          location,
          phone,
          image_url: imageUrl
        });

      if (insertError) throw insertError;

      // Reset form
      setCategory('');
      setStorageState('');
      setName('');
      setPrice('');
      setQuantity('');
      setLocation('');
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Refresh list
      await fetchUserAndProducts();
      alert('تمت إضافة المنتج بنجاح!');

    } catch (error: any) {
      console.error('Error adding product:', error);
      alert('حدث خطأ أثناء إضافة المنتج: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل تأكدت أن السلعة بيعت أو تريد حذف هذا المنتج؟ سيختفي العرض فوراً من الصفحة العامة.')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== id));
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setEditPrice(String(product.price));
    setEditQuantity(product.quantity);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    setEditSaving(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({ price: parseFloat(editPrice), quantity: editQuantity })
        .eq('id', editingProduct.id);

      if (error) throw error;

      setProducts(products.map(p =>
        p.id === editingProduct.id
          ? { ...p, price: parseFloat(editPrice), quantity: editQuantity }
          : p
      ));
      setEditingProduct(null);
    } catch (error: any) {
      alert('حدث خطأ أثناء التحديث: ' + error.message);
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7f6] font-cairo">

      {/* ── Edit Modal ── */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-extrabold text-gray-800 mb-1">تعديل المنتج</h3>
            <p className="text-sm text-gray-500 mb-6">{editingProduct.name}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">السعر الجديد (دج)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={e => setEditPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green outline-none text-gray-900 text-lg font-bold"
                  placeholder="مثال: 200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الكمية الجديدة</label>
                <input
                  type="text"
                  value={editQuantity}
                  onChange={e => setEditQuantity(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green outline-none text-gray-900 text-lg font-bold"
                  placeholder="مثال: 50 كلغ"
                />
              </div>
            </div>

            <button
              onClick={handleSaveEdit}
              disabled={editSaving}
              className="mt-6 w-full bg-agri-green hover:bg-agri-green-dark text-white font-bold py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {editSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {editSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>
        </div>
      )}
      <header className="w-full p-6 flex justify-between items-center bg-white shadow-sm border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 text-agri-green font-bold text-2xl">
          <Leaf className="h-8 w-8" />
          <span>{tIndex('title')}</span>
        </Link>
        <div className="text-agri-green font-semibold">
          {t('dashboardTitle')}
        </div>
      </header>

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <section className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-agri-green" />
            {t('addProduct')}
          </h2>
          
          <form onSubmit={handleAddProduct} className="space-y-4">
            
            {/* 1. Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">تصنيف المنتج</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green outline-none text-gray-900 font-bold"
                required
              >
                <option value="" disabled>-- اختر التصنيف --</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* 2. Detailed Form (Only visible if category is selected) */}
            <div className={`transition-all duration-500 overflow-hidden ${category ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-4 pt-4 border-t border-gray-100">
                
                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">صورة المنتج</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {imageFile ? (
                      <span className="text-agri-green font-bold text-sm truncate px-4">{imageFile.name}</span>
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-gray-500 text-sm">اضغط لاختيار صورة</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('productName')} (حسب الصنف المختار)</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green outline-none text-gray-900" 
                    placeholder="مثال: دقلة نور / لحم خروف / بطاطا" 
                    required={!!category} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">الكمية (الوزن أو العدد)</label>
                  <input 
                    type="text" 
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green outline-none text-gray-900" 
                    placeholder="مثال: 100 كلغ / 50 رأس" 
                    required={!!category} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">النوعية وحالة الحفظ</label>
                  <select
                    value={storageState}
                    onChange={(e) => setStorageState(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green outline-none text-gray-900"
                    required={!!category}
                  >
                    <option value="" disabled>-- اختر حالة الحفظ --</option>
                    {storageStates.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('price')}</label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green outline-none text-gray-900" 
                    placeholder="مثال: 150 (دج)" 
                    required={!!category} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('location')} / الولاية</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green outline-none text-gray-900" 
                    placeholder="مثال: البليدة" 
                    required={!!category} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{t('phone')}</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri-green outline-none text-gray-900" 
                    placeholder="0555000000" 
                    dir="ltr"
                    required={!!category} 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full mt-6 bg-agri-green hover:bg-agri-green-dark text-white font-bold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
                  {submitting ? 'جاري الإضافة...' : t('submit')}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* List Section */}
        <section className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('myProducts')}</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-agri-green" />
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500 font-semibold text-lg">لا توجد منتجات مضافة بعد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between overflow-hidden">
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">{product.quantity}</span>
                    </div>
                    {product.category && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md border border-blue-100">
                          {product.category}
                        </span>
                        {product.storage_state && (
                          <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2 py-1 rounded-md border border-purple-100">
                            {product.storage_state}
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-gray-600 font-semibold mb-1">{product.price} دج</p>
                    <p className="text-gray-500 text-sm mb-4">{product.location} • {product.phone}</p>
                  </div>
                  <div className="flex gap-2 border-t border-gray-100 p-3 mt-auto bg-gray-50">
                    <button 
                      onClick={() => handleOpenEdit(product)}
                      className="flex-1 flex justify-center items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-colors border border-blue-100"
                    >
                      <Pencil className="h-4 w-4" /> تعديل السعر/الكمية
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 flex justify-center items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 font-bold py-2.5 rounded-xl hover:bg-emerald-50 transition-colors border border-emerald-200 bg-emerald-50"
                    >
                      <CheckCircle2 className="h-4 w-4" /> تم البيع بنجاح ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
