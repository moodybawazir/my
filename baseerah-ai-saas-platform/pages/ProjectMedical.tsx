
import React from 'react';
import { 
  CalendarDays, Stethoscope, Users, Clock, Bell, 
  ShieldCheck, Activity, BarChart3, Plus, Search,
  CheckCircle2, AlertCircle, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectMedical: React.FC = () => {
  const stats = [
    { label: 'المرضى المسجلين', val: '٤,٢٥٠', icon: Users, color: 'text-emerald-400' },
    { label: 'مواعيد اليوم', val: '٣٨', icon: CalendarDays, color: 'text-[#cfd9cc]' },
    { label: 'تنبيهات SMS', val: '١٢,٥٠٠+', icon: Bell, color: 'text-amber-400' },
    { label: 'معدل الحضور', val: '٩٤٪', icon: Activity, color: 'text-white' },
  ];

  const upcomingAppointments = [
    { name: 'عبدالله العتيبي', time: '٠٩:٠٠ ص', type: 'كشف دوري', status: 'confirmed' },
    { name: 'فاطمة الزهراني', time: '١٠:٣٠ ص', type: 'استشارة عن بعد', status: 'pending' },
    { name: 'ياسر القحطاني', time: '٠١:٠٠ م', type: 'متابعة نتائج', status: 'confirmed' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0d2226]" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-black uppercase tracking-widest">
              <Stethoscope size={14} /> حلول الرعاية الصحية
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white">نظام المواعيد <span className="text-gradient">الذكي.</span></h1>
            <p className="text-xl text-[#cfd9cc]/60 max-w-2xl font-light">
              نظم عيادتك بذكاء. نظام متكامل لإدارة المرضى، المواعيد، والتنبيهات التلقائية لتقليل معدلات الغياب بنسبة تصل إلى ٤٠٪.
            </p>
          </div>
          <button className="bg-[#cfd9cc] text-[#0d2226] px-10 py-5 rounded-2xl font-black text-lg hover:bg-white transition-all shadow-glow flex items-center gap-3">
             تجربة لوحة الطبيب <Activity size={24} />
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24">
          <div className="lg:col-span-8 space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="glass p-6 rounded-[35px] border-white/5 text-center">
                  <div className="w-10 h-10 bg-[#1e403a] rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <stat.icon className={stat.color} size={20} />
                  </div>
                  <div className="text-2xl font-black text-white">{stat.val}</div>
                  <div className="text-[10px] font-bold text-[#cfd9cc]/30 uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Mock Table */}
            <div className="glass p-10 rounded-[45px] border-white/5">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-white">مواعيد الفترة الصباحية</h3>
                <div className="flex gap-2">
                   <button className="p-2 bg-white/5 rounded-lg text-[#cfd9cc]"><Search size={18}/></button>
                   <button className="p-2 bg-[#cfd9cc] rounded-lg text-[#0d2226]"><Plus size={18}/></button>
                </div>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.map((app, i) => (
                  <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-[#cfd9cc]/20 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center font-black text-white">{app.name[0]}</div>
                      <div>
                        <div className="font-bold text-white">{app.name}</div>
                        <div className="text-xs text-[#cfd9cc]/40">{app.type}</div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-black text-[#cfd9cc] mb-1">{app.time}</div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        app.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {app.status === 'confirmed' ? 'مؤكد' : 'في الانتظار'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="glass p-10 rounded-[45px] border-white/5 bg-gradient-to-br from-[#1e403a]/20 to-transparent">
              <h3 className="text-xl font-black text-white mb-6">المميزات الرئيسية</h3>
              <div className="space-y-6">
                {[
                  { t: 'جدولة تلقائية', d: 'حجز مواعيد عبر الويب والهاتف دون تدخل بشري.', i: Clock },
                  { t: 'تنبيهات ذكية', d: 'إرسال رسائل تذكير عبر واتساب وSMS تلقائياً.', i: Bell },
                  { t: 'تقارير طبية', d: 'نظام أرشفة سحابي آمن لنتائج الفحوصات.', i: FileText },
                  { t: 'أمن المعلومات', d: 'متوافق مع معايير HIPAA العالمية لسرية البيانات.', i: ShieldCheck }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      <item.i className="text-[#cfd9cc]" size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{item.t}</h4>
                      <p className="text-xs text-[#cfd9cc]/40 leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
           <h2 className="text-3xl font-black text-white mb-8">هل أنت مستعد لرقمنة منشأتك الطبية؟</h2>
           <Link to="/contact" className="inline-flex bg-[#cfd9cc] text-[#0d2226] px-12 py-5 rounded-2xl font-black text-xl hover:bg-white transition-all">
             طلب عرض سعر مخصص
           </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectMedical;
