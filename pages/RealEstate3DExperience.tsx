import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, Building2, ArrowRight } from 'lucide-react';
import SEO from '../src/components/SEO';
import ThreeDViewer from '../src/components/ThreeDViewer';
import { fetchIndustryDemo, fetchIndustryContent } from '../src/lib/industryQueries';

const RealEstate3DExperience: React.FC = () => {
    const { industryId } = useParams<{ industryId: string }>();
    const navigate = useNavigate();
    const [villaData, setVillaData] = useState<any>(null);
    const [demoDescription, setDemoDescription] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [activeRoom, setActiveRoom] = useState(0);
    const [isZooming, setIsZooming] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const id = industryId || 'real-estate';
                const [demoData, contentData] = await Promise.all([
                    fetchIndustryDemo(id, 'villa-yagout'),
                    fetchIndustryContent(id)
                ]);

                setVillaData(demoData);

                const threeDSection = contentData?.sections?.find(s => s.demo_type === 'three_d');
                if (threeDSection && threeDSection.description) {
                    setDemoDescription(threeDSection.description);
                } else {
                    setDemoDescription('استكشف أدق التفاصيل في نماذجنا ثلاثية الأبعاد. تنقل بين الغرف والمرافق لتجربة واقعية وعيش تفاصيل منزلك المستقبلي قبل بدء التنفيذ عبر تقنيات بصيرة التفاعلية.');
                }
            } catch (error) {
                console.error('Error loading real estate demo content:', error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [industryId]);

    if (loading || !villaData) {
        return <div className="min-h-screen bg-[#0d2226] flex items-center justify-center text-[#cfd9cc]">جاري التحميل...</div>;
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0d2226]" dir="rtl">
            <SEO
                title="تجربة تفاعلية ثلاثية الأبعاد | بصيرة"
                description="استكشف العقار بتقنية ثلاثية الأبعاد مع ميزات تفاعلية متطورة."
            />

            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 inline-flex items-center gap-2 text-[#cfd9cc]/60 hover:text-white transition-colors"
                >
                    <ArrowRight size={20} />
                    العودة للخدمات
                </button>

                <section className="mb-32">
                    <div className="glass p-12 md:p-16 rounded-[60px] border border-white/5 overflow-hidden">
                        <div className="mb-12">
                            <div className="inline-flex items-center gap-2 mb-4 text-[#cfd9cc] font-black uppercase tracking-[0.2em] text-sm">
                                <Sparkles size={18} /> تجربة افتراضية
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                                عش تجربة العقار قبل بنائه
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-12 space-y-6">
                                <div className="relative rounded-[40px] overflow-hidden shadow-2xl h-[500px] md:h-[700px] border border-white/5">
                                    <ThreeDViewer image={villaData.rooms[activeRoom].image} className={isZooming ? 'scale-110 blur-sm' : ''} />

                                    <div className="absolute top-8 right-8 flex flex-wrap gap-3">
                                        {villaData.rooms.map((room: any, i: number) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setIsZooming(true);
                                                    setTimeout(() => {
                                                        setActiveRoom(i);
                                                        setIsZooming(false);
                                                    }, 500);
                                                }}
                                                className={`px-6 py-3 rounded-xl font-black text-xs transition-all ${activeRoom === i ? 'bg-[#cfd9cc] text-[#0d2226] shadow-glow' : 'bg-black/40 text-white hover:bg-black/60 backdrop-blur-md'}`}
                                            >
                                                {room.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Dynamic description fetched from database */}
                                <div className="mt-8 text-center text-[#cfd9cc]/80 text-lg font-light leading-relaxed max-w-4xl mx-auto bg-white/5 p-6 rounded-3xl border border-white/10">
                                    {demoDescription}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RealEstate3DExperience;
