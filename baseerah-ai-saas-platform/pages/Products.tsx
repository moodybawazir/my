
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Package, ShoppingCart, ArrowLeft, 
  Sparkles, Filter, ChevronRight, Star, Cpu,
  BookOpen, Key, Globe, Layout, Database,
  FileText, Terminal, Code2, Layers
} from 'lucide-react';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('baseerah_products_data');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      // Default Fallback
      setProducts([
        { 
          id: 'automation-ebook', 
          title: 'كتاب: هندسة الأتمتة الشاملة', 
          price: '٢٥٠ ريال', 
          category: 'كتب رقمية',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
          desc: 'الدليل العملي لبناء وكلاء الذكاء الاصطناعي وربطهم بسلاسل العمليات المعقدة.',
          icon: 'BookOpen'
        },
        { 
          id: 'api-access-premium', 
          title: 'اشتراك API بصيرة المتقدم', 
          price: '٩٩٠ ريال / شهر', 
          category: 'اشتراكات API',
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800',
          desc: 'وصول مباشر لمحركات معالجة اللغة الطبيعية والتعرف على الصور الخاصة ببصيرة.',
          icon: 'Terminal'
        },
        { 
          id: 'real-estate-engine', 
          title: 'محرك العقارات الذكي (النسخة الكاملة)', 
          price: '٥,٥٠٠ ريال', 
          category: 'حلول جاهزة',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
          desc: 'المنظومة المتكاملة للمكاتب العقارية التي تبحث عن أتمتة شاملة لعملياتها.',
          icon: 'Layers'
        }
      ]);
    }
  }, []);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-48 pb-24 px-6 bg-[#0d2226]" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="text-center mb-24 space-y-10">
           <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20 text-[#cfd9cc] text-xs font-black uppercase tracking-widest">
              <Package size={14} /> متجر بصيرة الرقمي
           </div>
           <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tighter">
              منتجات <br /> <span className="text-gradient">تصيغ المستقبل.</span>
           </h1>
           <p className="text-2xl text-[#cfd9cc]/40 max-w-3xl mx-auto font-light leading-relaxed">
              حلولنا الرقمية متاحة الآن للاقتناء الفوري. من الكتب التعليمية إلى اشتراكات الـ API المتقدمة والتراخيص السيادية.
           </p>

           {/* Elegant Search Bar */}
           <div className="max-w-4xl mx-auto relative mt-16 group">
              <div className="absolute inset-y-0 right-0 flex items-center pr-10 pointer-events-none text-[#cfd9cc]/40 group-focus-within:text-[#cfd9cc]">
                 <Search size={28} />
              </div>
              <input 
                type="text" 
                placeholder="ابحث عن كتاب، اشتراك، أو نوع الخدمة..." 
                className="w-full bg-white/5 border border-white/10 rounded-[40px] pr-24 pl-10 py-8 text-white text-2xl outline-none focus:border-[#cfd9cc]/40 focus:bg-white/10 transition-all shadow-2xl backdrop-blur-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-6 flex items-center">
                 <button className="bg-[#cfd9cc] text-[#0d2226] p-4 rounded-2xl hover:bg-white transition-all shadow-glow">
                    <Filter size={24} />
                 </button>
              </div>
           </div>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           {filteredProducts.map((p) => (
             <Link 
               key={p.id} 
               to={`/project/${p.id}`}
               className="group glass rounded-[60px] overflow-hidden border-white/5 hover:border-[#cfd9cc]/30 transition-all flex flex-col h-full hover:-translate-y-4 duration-500 shadow-xl"
             >
                {/* Product Image */}
                <div className="relative h-80 overflow-hidden">
                   <img 
                    src={p.image} 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" 
                    alt={p.title} 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0d2226] via-transparent to-transparent opacity-60" />
                   <div className="absolute top-8 right-8 px-5 py-2 bg-black/40 backdrop-blur-md rounded-xl text-[10px] font-black text-[#cfd9cc] uppercase tracking-widest border border-white/10">
                      {p.category}
                   </div>
                </div>

                {/* Product Content */}
                <div className="p-12 flex flex-col flex-grow">
                   <div className="flex justify-between items-start mb-8">
                      <div className="w-16 h-16 bg-[#1e403a] rounded-2xl flex items-center justify-center text-[#cfd9cc] group-hover:rotate-12 transition-all duration-500 shadow-2xl border border-white/5">
                         <Layers size={32} />
                      </div>
                      <div className="text-3xl font-black text-white tracking-tighter">{p.price}</div>
                   </div>
                   <h3 className="text-3xl font-black text-white mb-6 group-hover:text-[#cfd9cc] transition-colors">{p.title}</h3>
                   <p className="text-[#cfd9cc]/40 text-base leading-relaxed mb-12 flex-grow font-light">
                      {p.desc}
                   </p>
                   <div className="flex items-center gap-4 text-[#cfd9cc] font-black text-xl group-hover:gap-8 transition-all">
                      استكشف المنتج <ArrowLeft size={28} />
                   </div>
                </div>
             </Link>
           ))}

           {filteredProducts.length === 0 && (
             <div className="col-span-full py-48 text-center glass rounded-[60px] border-white/5 opacity-40">
                <Search size={80} className="mx-auto mb-10 text-[#cfd9cc]/10" />
                <h3 className="text-4xl font-black text-white">لم نجد ما تبحث عنه</h3>
                <p className="text-2xl text-[#cfd9cc]/40 mt-6 font-light">حاول استخدام كلمات مفتاحية مثل "كتاب" أو "ذكاء"</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Products;
