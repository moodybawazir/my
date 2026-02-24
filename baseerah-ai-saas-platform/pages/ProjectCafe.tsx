
import React, { useState } from 'react';
import { 
  Coffee, ShoppingBag, Award, Clock, ArrowLeft, 
  ChevronRight, Star, Heart, MapPin, Search, Plus,
  Layout, Smartphone, CheckCircle2, QrCode
} from 'lucide-react';

const ProjectCafe: React.FC = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [loyaltyPoints, setLoyaltyPoints] = useState(5); // المستخدم شاري ٥ قهوات

  const menu = [
    { name: 'لاتيه كورتادو', price: '١٨ ريال', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400' },
    { name: 'فلات وايت', price: '٢٢ ريال', image: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=400' },
    { name: 'كابتشينو', price: '٢٠ ريال', image: 'https://images.unsplash.com/photo-1572286258217-40142c1c6a70?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0d2226]" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          {/* Text Content */}
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#1e403a]/30 border border-[#cfd9cc]/20 px-4 py-1.5 rounded-full text-[#cfd9cc] text-xs font-bold uppercase tracking-widest">
              <Coffee size={14} /> حلول الضيافة الذكية
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">تطبيق الكافيه <br /><span className="text-gradient">المتكامل.</span></h1>
            <p className="text-xl text-[#cfd9cc]/60 leading-relaxed font-light">
              نظام إدارة متكامل يربط بين الكاشير وتطبيق العميل. يتيح للعملاء الطلب المسبق، تتبع الطلبات، والمشاركة في برنامج الولاء الذكي.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="glass p-8 rounded-[40px] border-white/5">
                 <h4 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                   <Award className="text-[#cfd9cc]" /> نظام الولاء ٨+١
                 </h4>
                 <p className="text-sm text-[#cfd9cc]/40 leading-relaxed">تلقائياً، عند وصول العميل للقهوة الثامنة، يحصل على كوبون مجاني للكوب التاسع يتم تفعيله عبر QR Code.</p>
               </div>
               <div className="glass p-8 rounded-[40px] border-white/5">
                 <h4 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                   <QrCode className="text-[#cfd9cc]" /> سرعة التنفيذ
                 </h4>
                 <p className="text-sm text-[#cfd9cc]/40 leading-relaxed">تجهيز الطلبات عبر التطبيق يقلل وقت الانتظار في الكافيه بنسبة ٦٠٪ ويزيد المبيعات.</p>
               </div>
            </div>
          </div>

          {/* App Simulation */}
          <div className="flex-1 w-full max-w-sm relative">
            <div className="absolute -inset-10 bg-[#cfd9cc]/10 blur-[100px] rounded-full -z-10" />
            
            {/* Phone Frame */}
            <div className="bg-black rounded-[60px] p-4 border-[8px] border-white/5 shadow-2xl overflow-hidden aspect-[9/19]">
               <div className="bg-white h-full rounded-[45px] overflow-hidden flex flex-col relative">
                  
                  {/* App Header */}
                  <div className="p-6 pt-12 bg-white flex justify-between items-center">
                     <div>
                       <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">أهلاً بك</div>
                       <div className="text-lg font-black text-[#0d2226]">محمد السبيعي</div>
                     </div>
                     <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingBag size={20} className="text-[#0d2226]" />
                     </div>
                  </div>

                  {/* Loyalty Card */}
                  <div className="px-6 pb-6">
                    <div className="bg-[#1e403a] rounded-[30px] p-6 text-white relative overflow-hidden">
                       <div className="relative z-10">
                          <div className="text-xs opacity-60 mb-1">بطاقة الولاء الرقمية</div>
                          <div className="text-xl font-black mb-6">استمتع بكوبك المجاني</div>
                          
                          {/* Coffee Slots */}
                          <div className="grid grid-cols-4 gap-3">
                             {[1,2,3,4,5,6,7,8].map((i) => (
                               <div key={i} className={`aspect-square rounded-full flex items-center justify-center border-2 ${i <= loyaltyPoints ? 'bg-[#cfd9cc] border-[#cfd9cc]' : 'bg-transparent border-white/20'}`}>
                                  <Coffee size={14} className={i <= loyaltyPoints ? 'text-[#0d2226]' : 'text-white/20'} />
                               </div>
                             ))}
                          </div>
                          <div className="mt-4 text-[10px] font-bold text-[#cfd9cc]">بقي لك ٣ أكواب لتحصل على القهوة المجانية!</div>
                       </div>
                    </div>
                  </div>

                  {/* Menu Tabs */}
                  <div className="px-6 flex gap-4 mb-4">
                     <button onClick={() => setActiveTab('menu')} className={`pb-2 text-sm font-black border-b-2 ${activeTab === 'menu' ? 'border-[#1e403a] text-[#0d2226]' : 'border-transparent text-gray-300'}`}>القائمة</button>
                     <button onClick={() => setActiveTab('recent')} className={`pb-2 text-sm font-black border-b-2 ${activeTab === 'recent' ? 'border-[#1e403a] text-[#0d2226]' : 'border-transparent text-gray-300'}`}>المفضلة</button>
                  </div>

                  {/* Menu List */}
                  <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-24">
                     {menu.map((item, i) => (
                       <div key={i} className="flex gap-4 items-center p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                          <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                          <div className="flex-1">
                             <div className="font-black text-[#0d2226]">{item.name}</div>
                             <div className="text-xs text-[#1e403a] font-bold">{item.price}</div>
                          </div>
                          <button className="w-8 h-8 bg-white shadow-sm rounded-lg flex items-center justify-center text-[#1e403a]"><Plus size={16}/></button>
                       </div>
                     ))}
                  </div>

                  {/* App Navigation */}
                  <div className="absolute bottom-0 left-0 w-full h-20 bg-white border-t flex justify-around items-center px-6">
                     <div className="text-[#1e403a] flex flex-col items-center gap-1"><Smartphone size={20} /><span className="text-[8px] font-bold">الرئيسية</span></div>
                     <div className="text-gray-300 flex flex-col items-center gap-1"><Search size={20} /><span className="text-[8px] font-bold">بحث</span></div>
                     <div className="text-gray-300 flex flex-col items-center gap-1"><MapPin size={20} /><span className="text-[8px] font-bold">الفروع</span></div>
                     <div className="text-gray-300 flex flex-col items-center gap-1"><Award size={20} /><span className="text-[8px] font-bold">الجوائز</span></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCafe;
