
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, Clock, User } from 'lucide-react';

const AppointmentCalendar: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Mock appointments
    const appointments = [
        { time: '09:00 ص', patient: 'أحمد القحطاني', type: 'كشف دوري' },
        { time: '10:30 ص', patient: 'سارة خالد', type: 'متابعة' },
        { time: '01:00 م', patient: 'محمد العلي', type: 'استشارة AI' },
    ];

    const days = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

    return (
        <div className="glass rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
            <div className="bg-[#1e403a]/20 p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#cfd9cc] rounded-xl text-[#0d2226]">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white">إدارة المواعيد الذكية</h3>
                        <p className="text-[#cfd9cc]/40 text-xs">نظرة عامة على جدول اليوم</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><ChevronRight size={20} /></button>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7">
                {/* Calendar Grid (Simplified for Demo) */}
                <div className="lg:col-span-4 p-8 border-l border-white/5">
                    <div className="grid grid-cols-7 gap-2 mb-6">
                        {days.map(d => <div key={d} className="text-center text-[10px] font-black text-[#cfd9cc]/30 uppercase tracking-widest">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {[...Array(31)].map((_, i) => (
                            <div
                                key={i}
                                className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold cursor-pointer transition-all ${i + 1 === 16 ? 'bg-[#cfd9cc] text-[#0d2226] shadow-glow' : 'hover:bg-white/5 text-[#cfd9cc]/60'}`}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Appointments List */}
                <div className="lg:col-span-3 p-8 bg-black/20">
                    <h4 className="text-sm font-black text-[#cfd9cc] mb-6 uppercase tracking-widest">مواعيد اليوم</h4>
                    <div className="space-y-4">
                        {appointments.map((apt, i) => (
                            <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-[#cfd9cc]/20 transition-all group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-[#cfd9cc] text-xs font-bold">
                                        <Clock size={14} /> {apt.time}
                                    </div>
                                    <div className="px-2 py-0.5 rounded-md bg-[#cfd9cc]/10 text-[#cfd9cc] text-[10px] font-black uppercase">مؤكد</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#cfd9cc]/40">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-white group-hover:text-[#cfd9cc] transition-colors">{apt.patient}</div>
                                        <div className="text-[10px] text-[#cfd9cc]/40">{apt.type}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-black hover:bg-white hover:text-[#0d2226] transition-all">
                        إضافة موعد جديد +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentCalendar;
