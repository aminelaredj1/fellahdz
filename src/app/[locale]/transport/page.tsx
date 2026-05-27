"use client";

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { Leaf, Truck, Phone, MapPin, Loader2, CheckCircle, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const wilayas = [
  'أدرار','الشلف','الأغواط','أم البواقي','باتنة','بجاية','بسكرة','بشار',
  'البليدة','البويرة','تمنراست','تبسة','تلمسان','تيارت','تيزي وزو','الجزائر',
  'الجلفة','جيجل','سطيف','سعيدة','سكيكدة','سيدي بلعباس','عنابة','قالمة',
  'قسنطينة','المدية','مستغانم','المسيلة','معسكر','ورقلة','وهران','البيض',
  'إليزي','برج بوعريريج','بومرداس','الطارف','تندوف','تسيمسيلت','الوادي',
  'خنشلة','سوق أهراس','تيبازة','ميلة','عين الدفلى','النعامة','عين تموشنت',
  'غرداية','غليزان','تيميمون','برج باجي مختار','أولاد جلال','بني عباس',
  'إن صالح','إن قزام','تقرت','جانت','المغير','المنيعة'
];

const vehicleTypes = [
  'شاحنة صغيرة (Harbin / K6)',
  'شاحنة متوسطة (Jac / Sonacom)',
  'شاحنة تبريد (Frigo)',
  'جرار فلاحي',
  'أخرى',
];

const vehicleIcons: Record<string, string> = {
  'شاحنة صغيرة (Harbin / K6)': '🚐',
  'شاحنة متوسطة (Jac / Sonacom)': '🚛',
  'شاحنة تبريد (Frigo)': '❄️',
  'جرار فلاحي': '🚜',
  'أخرى': '🚚',
};

export default function TransportPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [filterWilaya, setFilterWilaya] = useState('الكل');

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setDrivers(data || []);
    } catch (err) {
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('drivers').insert({
        full_name: fullName,
        phone,
        wilaya,
        vehicle_type: vehicleType,
      });
      if (error) throw error;
      setSuccess(true);
      setFullName(''); setPhone(''); setWilaya(''); setVehicleType('');
      setShowForm(false);
      await fetchDrivers();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      alert('حدث خطأ أثناء التسجيل: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDrivers = filterWilaya === 'الكل'
    ? drivers
    : drivers.filter(d => d.wilaya === filterWilaya);

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f8] font-cairo">
      
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center bg-white shadow-sm border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 text-agri-green font-bold text-2xl">
          <Leaf className="h-8 w-8" />
          <span>فلاح DZ</span>
        </Link>
        <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
          <Truck className="h-6 w-6" />
          <span>ناقلو السلع</span>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-l from-blue-700 to-blue-500 text-white py-10 px-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 rounded-full p-4">
            <Truck className="h-12 w-12" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">منصة ناقلي السلع الفلاحية</h1>
        <p className="text-blue-100 text-lg max-w-xl mx-auto">
          سجّل شاحنتك وتواصل مع الفلاحين الذين يحتاجون إلى نقل منتجاتهم عبر الجزائر.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="mt-6 inline-flex items-center gap-2 bg-white text-blue-700 font-extrabold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5" />
          سجّل شاحنتك الآن
        </button>
      </div>

      {/* Success Toast */}
      {success && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-agri-green text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold">
          <CheckCircle className="h-5 w-5" />
          تم تسجيل شاحنتك بنجاح! ستظهر في القائمة فوراً.
        </div>
      )}

      {/* Registration Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-2xl">
                <Truck className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-800">تسجيل سائق جديد</h2>
                <p className="text-sm text-gray-500">أدخل بياناتك لتظهر في قائمة السائقين</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الاسم واللقب</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  placeholder="مثال: محمد بلقاسم"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  placeholder="0555 00 00 00"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الولاية المتواجد فيها</label>
                <select
                  value={wilaya}
                  onChange={e => setWilaya(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  required
                >
                  <option value="" disabled>-- اختر الولاية --</option>
                  {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">نوع المركبة</label>
                <select
                  value={vehicleType}
                  onChange={e => setVehicleType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  required
                >
                  <option value="" disabled>-- اختر نوع الشاحنة --</option>
                  {vehicleTypes.map(v => <option key={v} value={v}>{vehicleIcons[v]} {v}</option>)}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Truck className="h-5 w-5" />}
                {submitting ? 'جاري التسجيل...' : 'تسجيل شاحنتي'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        
        {/* Filter by Wilaya */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <h2 className="text-2xl font-extrabold text-gray-800">
            السائقون المتاحون
            <span className="mr-2 text-base font-semibold text-gray-500">({filteredDrivers.length})</span>
          </h2>
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm">
            <MapPin className="h-5 w-5 text-blue-500" />
            <select
              value={filterWilaya}
              onChange={e => setFilterWilaya(e.target.value)}
              className="bg-transparent outline-none text-gray-900 font-bold min-w-[160px]"
            >
              <option value="الكل">كل الولايات</option>
              {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500 mb-2">لا يوجد سائقون في هذه الولاية</h3>
            <p className="text-gray-400">كن أول من يسجل شاحنته هنا!</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl"
            >
              <Plus className="h-4 w-4" /> سجّل الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map(driver => (
              <div
                key={driver.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-l from-blue-600 to-blue-500 p-5 text-white">
                  <div className="text-4xl mb-2">{vehicleIcons[driver.vehicle_type] || '🚚'}</div>
                  <h3 className="text-xl font-extrabold">{driver.full_name}</h3>
                  <p className="text-blue-200 text-sm mt-0.5">{driver.vehicle_type}</p>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex items-center gap-3 text-gray-700 font-medium">
                    <MapPin className="h-5 w-5 text-blue-400 shrink-0" />
                    <span>{driver.wilaya}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 font-medium">
                    <Phone className="h-5 w-5 text-blue-400 shrink-0" />
                    <span dir="ltr">{driver.phone}</span>
                  </div>
                </div>

                {/* Call Button */}
                <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                  <a
                    href={`tel:${driver.phone}`}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl shadow-sm transition-all transform hover:scale-[1.02]"
                  >
                    <Phone className="h-5 w-5" />
                    اتصال مباشر
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-100 mt-8">
        © {new Date().getFullYear()} فلاح DZ — منصة ناقلي السلع الفلاحية
      </footer>
    </div>
  );
}
