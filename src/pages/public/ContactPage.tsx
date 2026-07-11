// =========================================================================
// MetaFore Technologies - Contact Us Page
// =========================================================================

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Mail, Phone, MessageSquare, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/common/Button';

export const ContactPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ফর্মের ডেটা স্টেট
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ফর্ম সাবমিশন লজিক (আপাতত সিমুলেশন করা হচ্ছে, পরবর্তীতে ফায়ারবেসের সাথে যুক্ত হবে)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ফেইক লোডিং টাইম (১.৫ সেকেন্ড)
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        language === 'en' 
          ? 'Message sent successfully! We will get back to you soon.' 
          : 'আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।'
      );
      // ফর্ম ক্লিয়ার করা
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-electric" />,
      title: language === 'en' ? 'Call Us' : 'কল করুন',
      details: '+88-019833-98333',
      action: 'tel:+8801983398333'
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-purple-accent" />,
      title: language === 'en' ? 'WhatsApp' : 'হোয়াটসঅ্যাপ',
      details: '+88-019833-98333',
      action: 'https://wa.me/8801983398333'
    },
    {
      icon: <Mail className="w-6 h-6 text-electric-bright" />,
      title: language === 'en' ? 'Email Address' : 'ইমেইল এড্রেস',
      details: 'metafore.technologies.itc@gmail.com',
      action: 'mailto:metafore.technologies.itc@gmail.com'
    },
    {
      icon: <Clock className="w-6 h-6 text-electric" />,
      title: t.contact.businessHours,
      details: language === 'en' ? 'Saturday - Thursday (10 AM - 7 PM)' : 'শনিবার - বৃহস্পতিবার (সকাল ১০টা - সন্ধ্যা ৭টা)',
      action: null
    }
  ];

  return (
    <div className="w-full flex flex-col">
      <Helmet>
        <title>{t.navigation.contact} | MetaFore Technologies</title>
        <meta name="description" content={language === 'en' ? 'Get in touch with MetaFore Technologies for your next digital project.' : 'আপনার পরবর্তী ডিজিটাল প্রজেক্টের জন্য মেটাফোর টেকনোলজিসের সাথে যোগাযোগ করুন।'} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-borderColor bg-navy-surface">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
        <Container className="relative z-10 text-center max-w-4xl">
          <SectionHeading 
            badge={t.navigation.contact}
            title={language === 'en' ? "Let's Start a Conversation" : 'চলুন কথা বলি'}
            subtitle={language === 'en' 
              ? 'Have a project in mind or need technical consultation? Our team is ready to help you turn your ideas into reality.' 
              : 'নতুন কোনো প্রজেক্ট নিয়ে ভাবছেন বা টেকনিক্যাল পরামর্শ প্রয়োজন? আপনার আইডিয়াকে বাস্তবে রূপ দিতে আমাদের টিম প্রস্তুত।'}
            className="mx-auto"
          />
        </Container>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 lg:py-28 relative bg-navy">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Left Side: Contact Information */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  {language === 'en' ? 'Contact Information' : 'যোগাযোগের তথ্য'}
                </h2>
                <p className={`text-soft-gray leading-relaxed mb-8 ${language === 'bn' ? 'bn-text-safe' : ''}`}>
                  {language === 'en' 
                    ? 'Fill out the form and our team will get back to you within 24 hours. Alternatively, you can reach us directly via phone or email.' 
                    : 'ফর্মটি পূরণ করুন এবং আমাদের টিম ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে। এছাড়াও আপনি সরাসরি ফোন বা ইমেইলের মাধ্যমে আমাদের সাথে যোগাযোগ করতে পারেন।'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-xl border-borderColor">
                    <div className="w-12 h-12 rounded-lg bg-navy-surface border border-borderColor flex items-center justify-center mb-4">
                      {info.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-2">{info.title}</h3>
                    {info.action ? (
                      <a href={info.action} target={info.icon.type.name === 'MessageSquare' ? "_blank" : "_self"} rel="noopener noreferrer" className="text-soft-gray text-sm hover:text-electric transition-colors block break-all">
                        {info.details}
                      </a>
                    ) : (
                      <p className="text-soft-gray text-sm">{info.details}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Office Address Card */}
              <div className="glass-panel p-6 rounded-xl border-borderColor flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-navy-surface border border-borderColor flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-electric" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">{t.contact.officeAddress}</h3>
                  <p className="text-soft-gray text-sm leading-relaxed">
                    Dhaka, Bangladesh<br />
                    (Detailed address available upon scheduled meeting)
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-8 md:p-10 rounded-2xl border-borderColor h-full">
                <h2 className="text-2xl font-bold text-white mb-8">
                  {language === 'en' ? 'Send Us a Message' : 'আমাদের মেসেজ পাঠান'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-soft-gray">{t.contact.nameLabel} *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-navy-surface border border-borderColor rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all"
                        placeholder={language === 'en' ? 'John Doe' : 'আপনার নাম'}
                      />
                    </div>
                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-soft-gray">{t.contact.emailLabel} *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-navy-surface border border-borderColor rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all"
                        placeholder={language === 'en' ? 'john@example.com' : 'আপনার ইমেইল'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-soft-gray">{t.contact.phoneLabel} *</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-navy-surface border border-borderColor rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all"
                        placeholder={language === 'en' ? '+880 1XXX XXXXXX' : '+৮৮০ ১XXX XXXXXX'}
                      />
                    </div>
                    {/* Company (Optional) */}
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium text-soft-gray">{t.contact.companyLabel} ({language === 'en' ? 'Optional' : 'ঐচ্ছিক'})</label>
                      <input 
                        type="text" 
                        id="company" 
                        name="company" 
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full bg-navy-surface border border-borderColor rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all"
                        placeholder={language === 'en' ? 'Your Company Name' : 'কোম্পানির নাম'}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-soft-gray">{t.contact.messageLabel} *</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-navy-surface border border-borderColor rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-all resize-none"
                      placeholder={language === 'en' ? 'Tell us about your project requirements...' : 'আপনার প্রজেক্টের বিস্তারিত আমাদের জানান...'}
                    ></textarea>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    fullWidth 
                    isLoading={isSubmitting}
                    rightIcon={!isSubmitting && <Send className="w-5 h-5" />}
                  >
                    {t.contact.sendButton}
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Google Maps Section */}
      <section className="h-[400px] w-full border-t border-borderColor relative grayscale hover:grayscale-0 transition-all duration-700">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d233667.8223908687!2d90.27923710646989!3d23.780887457084543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1705600000000!5m2!1sen!2sus" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="MetaFore Technologies Location"
        ></iframe>
      </section>
    </div>
  );
};