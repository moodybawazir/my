import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { Shield, RefreshCw } from 'lucide-react';

const Policy: React.FC = () => {
    const { policyId } = useParams<{ policyId: string }>();
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicy = async () => {
            setLoading(true);
            const sectionKey = policyId === 'refund' ? 'refund_policy' : 'privacy_policy';

            const { data, error } = await supabase
                .from('content_pages')
                .select('*')
                .eq('section_key', sectionKey)
                .single();

            if (!error && data) {
                setContent(data);
            } else {
                // Fallback default
                setContent({
                    title: policyId === 'refund' ? 'سياسة الاسترجاع' : 'سياسة الخصوصية والاستخدام',
                    content: 'لم يتم إضافة محتوى لهذه الصفحة بعد. الرجاء مراجعة الإدارة.'
                });
            }
            setLoading(false);
        };

        fetchPolicy();
    }, [policyId]);

    if (loading) {
        return <div className="min-h-screen bg-[#0d2226] flex items-center justify-center text-[#cfd9cc]">جاري التحميل...</div>;
    }

    return (
        <div className="pt-40 pb-32 px-6 min-h-screen bg-[#0d2226]" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-6 px-6 py-2 rounded-full bg-[#1e403a]/40 border border-[#cfd9cc]/20">
                        {policyId === 'refund' ? (
                            <RefreshCw size={18} className="text-[#cfd9cc]" />
                        ) : (
                            <Shield size={18} className="text-[#cfd9cc]" />
                        )}
                        <span className="text-xs font-black text-[#cfd9cc] uppercase tracking-widest">
                            السياسات والأحكام
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter leading-tight">
                        {content?.content?.title || content?.title}
                    </h1>
                </header>

                <div className="glass p-12 md:p-20 rounded-[50px] border-white/5 shadow-2xl">
                    <div
                        className="prose prose-invert prose-lg max-w-none text-[#cfd9cc]/80 
            prose-headings:text-white prose-headings:font-black prose-p:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: content?.content?.text || content?.content || '' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Policy;
