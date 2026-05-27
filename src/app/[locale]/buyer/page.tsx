"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Leaf, Search, Phone, MapPin, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function BuyerDashboard() {
  const t = useTranslations('Buyer');
  const tIndex = useTranslations('Index');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const categories = ['الكل', 'خضر', 'فواكه', 'أغنام', 'مواشي', 'لحوم', 'تمور', 'حبوب وبقوليات', 'ألبان وأجبان', 'أخرى'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch products');
      }
      const data = await res.json();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7f6] font-cairo">
      <header className="w-full p-6 flex justify-between items-center bg-white shadow-sm border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 text-agri-green font-bold text-2xl">
          <Leaf className="h-8 w-8" />
          <span>{tIndex('title')}</span>
        </Link>
        <div className="text-agri-brown font-bold text-lg">
          {t('dashboardTitle')}
        </div>
      </header>

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        
        {/* Search & Filter Section */}
        <section className="mb-10 max-w-4xl mx-auto relative mt-4">
          <div className="relative flex items-center w-full h-14 rounded-2xl focus-within:shadow-lg focus-within:ring-2 focus-within:ring-agri-green bg-white overflow-hidden border border-gray-200 transition-all mb-6 max-w-2xl mx-auto">
            <div className="grid place-items-center h-full w-14 text-gray-400">
              <Search className="h-6 w-6" />
            </div>
            <input
              className="peer h-full w-full outline-none text-gray-900 pr-2 font-semibold text-lg"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')} 
            />
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-4 px-2 snap-x">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 snap-start px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                  selectedCategory === category 
                    ? 'bg-agri-green text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-green-50 hover:text-agri-green hover:border-green-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Grid Section */}
        <section>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-agri-green" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-500 mb-2">لا توجد منتجات مطابقة</h3>
              <p className="text-gray-400">جرب البحث بكلمات أخرى</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                // Extract farmer name from joined user metadata if available
                const farmerName = product.users?.raw_user_meta_data?.username || 'فلاح';
                
                // We don't need formatted phone for standard call

                return (
                  <div key={product.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    
                    {/* Product Image */}
                    <div className="h-56 bg-gray-100 relative w-full">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Leaf className="h-16 w-16 opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                        <span className="font-bold text-agri-green">{product.price} دج</span>
                        <span className="text-xs text-gray-500 mr-1">/ للكيلو</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                        <span className="bg-green-50 text-green-700 text-sm font-bold px-3 py-1.5 rounded-xl border border-green-100">
                          {product.quantity}
                        </span>
                      </div>

                      {product.category && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-100">
                            {product.category}
                          </span>
                          {product.storage_state && (
                            <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-purple-100">
                              {product.storage_state}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="space-y-3 mt-2">
                        <p className="flex items-center gap-3 text-gray-700 font-medium">
                          <MapPin className="h-5 w-5 text-gray-400"/>
                          <span>{product.location}</span>
                        </p>
                        <p className="flex items-center gap-3 text-gray-700 font-medium">
                          <div className="h-5 w-5 rounded-full bg-agri-green/10 flex items-center justify-center text-agri-green text-xs font-bold">
                            {farmerName.charAt(0)}
                          </div>
                          <span>{farmerName}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-5 mt-auto border-t border-gray-50 bg-gray-50/50">
                      <a 
                        href={`tel:${product.phone}`}
                        className="w-full flex items-center justify-center gap-3 bg-agri-green hover:bg-agri-green-dark text-white font-bold py-3.5 rounded-2xl shadow-sm transition-all transform hover:scale-[1.02]"
                      >
                        <Phone className="h-5 w-5" />
                        اتصال مباشر
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
