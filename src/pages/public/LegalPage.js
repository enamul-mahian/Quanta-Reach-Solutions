import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Container } from '/src/components/common/Container.js';
import { SectionHeading } from '/src/components/common/SectionHeading.js';
import { SITE } from '/src/config/site.js';
import { useLanguage } from '/src/hooks/useLanguage.js';
import { sanitizeHtml } from '/src/lib/sanitizeHtml.js';
import { getLegalPage } from '/src/services/legalPageService.js';
const aliases = {
    privacy: 'privacy-policy',
    'privacy-policy': 'privacy-policy',
    terms: 'terms-and-conditions',
    'terms-and-conditions': 'terms-and-conditions',
    refund: 'refund-policy',
    'refund-policy': 'refund-policy',
    nda: 'nda-and-confidentiality',
    'nda-and-confidentiality': 'nda-and-confidentiality',
};
const fallbackPages = {
    'privacy-policy': {
        type: 'privacy-policy',
        title: { en: 'Privacy Policy', bn: 'প্রাইভেসি পলিসি' },
        content: {
            en: '<p>Quanta Reach Solutions collects only the information needed to respond to inquiries, deliver agreed services, maintain security, and meet legal obligations. We do not sell personal information.</p><p>Information submitted through contact, quotation, meeting, or client forms may be stored with our service providers. You may contact us to request access, correction, or deletion where applicable.</p>',
            bn: '<p>Quanta Reach Solutions কেবল অনুসন্ধানের উত্তর দেওয়া, সম্মত সেবা প্রদান, নিরাপত্তা বজায় রাখা এবং আইনগত দায়িত্ব পালনের জন্য প্রয়োজনীয় তথ্য সংগ্রহ করে। আমরা ব্যক্তিগত তথ্য বিক্রি করি না।</p><p>কন্টাক্ট, কোটেশন, মিটিং বা ক্লায়েন্ট ফর্মে দেওয়া তথ্য আমাদের সেবা প্রদানকারীর মাধ্যমে সংরক্ষিত হতে পারে। প্রযোজ্য ক্ষেত্রে তথ্য দেখা, সংশোধন বা মুছে ফেলার অনুরোধ করতে পারেন।</p>',
        },
        seo: { title: 'Privacy Policy', description: 'Privacy practices of Quanta Reach Solutions.', keywords: ['privacy', 'data'] },
        status: 'Published',
    },
    'terms-and-conditions': {
        type: 'terms-and-conditions',
        title: { en: 'Terms and Conditions', bn: 'শর্তাবলী' },
        content: {
            en: '<p>Use of this website is subject to these terms. Project scope, deliverables, payment stages, timelines, revisions, support, intellectual property, and third-party costs are governed by the written proposal or agreement accepted by the client.</p><p>Website information is provided in good faith and may be updated without notice.</p>',
            bn: '<p>এই ওয়েবসাইট ব্যবহার করলে এসব শর্ত প্রযোজ্য হবে। প্রজেক্টের পরিধি, ডেলিভারি, পেমেন্ট ধাপ, সময়সীমা, রিভিশন, সাপোর্ট, মেধাস্বত্ব ও তৃতীয় পক্ষের খরচ ক্লায়েন্টের গৃহীত লিখিত প্রস্তাব বা চুক্তি অনুযায়ী পরিচালিত হবে।</p><p>ওয়েবসাইটের তথ্য সৎ উদ্দেশ্যে দেওয়া হয়েছে এবং নোটিশ ছাড়াই আপডেট হতে পারে।</p>',
        },
        seo: { title: 'Terms and Conditions', description: 'Website and service terms of Quanta Reach Solutions.', keywords: ['terms', 'services'] },
        status: 'Published',
    },
    'refund-policy': {
        type: 'refund-policy',
        title: { en: 'Refund Policy', bn: 'রিফান্ড পলিসি' },
        content: {
            en: '<p>Refund eligibility depends on the accepted agreement, work already completed, non-refundable third-party costs, and the stage at which cancellation is requested. Approved refunds are processed using the agreed payment method and timeline.</p>',
            bn: '<p>রিফান্ডের যোগ্যতা গৃহীত চুক্তি, ইতোমধ্যে সম্পন্ন কাজ, ফেরতযোগ্য নয় এমন তৃতীয় পক্ষের খরচ এবং বাতিলের অনুরোধের ধাপের ওপর নির্ভর করে। অনুমোদিত রিফান্ড সম্মত পেমেন্ট পদ্ধতি ও সময়সীমা অনুযায়ী সম্পন্ন হয়।</p>',
        },
        seo: { title: 'Refund Policy', description: 'Refund policy of Quanta Reach Solutions.', keywords: ['refund'] },
        status: 'Published',
    },
    'nda-and-confidentiality': {
        type: 'nda-and-confidentiality',
        title: { en: 'NDA and Confidentiality', bn: 'NDA ও গোপনীয়তা' },
        content: {
            en: '<p>Confidential project information is used only for evaluation and delivery of the agreed work. A mutual or client-provided NDA may be signed before sensitive materials are shared.</p>',
            bn: '<p>গোপনীয় প্রজেক্ট তথ্য শুধু মূল্যায়ন ও সম্মত কাজ সম্পন্ন করার জন্য ব্যবহার করা হয়। সংবেদনশীল তথ্য শেয়ারের আগে পারস্পরিক বা ক্লায়েন্ট-প্রদত্ত NDA স্বাক্ষর করা যেতে পারে।</p>',
        },
        seo: { title: 'NDA and Confidentiality', description: 'Confidentiality practices of Quanta Reach Solutions.', keywords: ['nda', 'confidentiality'] },
        status: 'Published',
    },
};
export const LegalPage = () => {
    const { type = '' } = useParams();
    const { language } = useLanguage();
    const legalType = aliases[type];
    const [content, setContent] = useState(legalType ? fallbackPages[legalType] : null);
    const [loading, setLoading] = useState(Boolean(legalType));
    useEffect(() => {
        let active = true;
        if (!legalType) {
            setContent(null);
            setLoading(false);
            return () => { active = false; };
        }
        setLoading(true);
        getLegalPage(legalType)
            .then((page) => {
            if (active && page?.status === 'Published')
                setContent(page);
        })
            .catch((error) => console.warn('Using bundled legal-page content because the CMS page was unavailable.', error))
            .finally(() => { if (active)
            setLoading(false); });
        return () => { active = false; };
    }, [legalType]);
    const html = useMemo(() => content ? sanitizeHtml(content.content[language]) : '', [content, language]);
    if (loading && !content) {
        return _jsx("div", { className: "flex min-h-[60vh] items-center justify-center bg-[#071426] text-white/50", children: language === 'en' ? 'Loading…' : 'লোড হচ্ছে…' });
    }
    if (!content) {
        return _jsx("main", { className: "min-h-screen bg-[#071426] px-6 pb-24 pt-40 text-center text-white", children: _jsx("h1", { className: "text-4xl font-black", children: language === 'en' ? 'Legal page not found' : 'লিগ্যাল পেজটি পাওয়া যায়নি' }) });
    }
    const pageTitle = content.title[language];
    return (_jsxs("main", { className: "min-h-screen bg-[#071426] pb-24 pt-36 text-white", children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [pageTitle, " | ", SITE.name] }), _jsx("meta", { name: "description", content: content.seo.description || pageTitle })] }), _jsx(Container, { className: "max-w-4xl", children: _jsxs("div", { className: "glass-panel rounded-3xl border-borderColor p-8 md:p-12", children: [_jsx(SectionHeading, { title: pageTitle, align: "left", className: "mb-8" }), _jsx("div", { className: `prose prose-invert max-w-none leading-8 text-soft-gray ${language === 'bn' ? 'bn-text-safe' : ''}`, dangerouslySetInnerHTML: { __html: html } }), _jsxs("p", { className: "mt-10 border-t border-white/10 pt-5 text-xs font-mono uppercase tracking-widest text-white/30", children: [language === 'en' ? 'For questions, contact' : 'প্রশ্নের জন্য যোগাযোগ করুন', ": ", SITE.email] })] }) })] }));
};
