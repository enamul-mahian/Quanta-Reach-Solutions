import { getEnvVar } from '/src/lib/env.js';
export const SITE = {
    name: 'Quanta Reach Solutions',
    shortName: 'Quanta Reach',
    tagline: 'Digital Solutions for Global Growth',
    logo: '/assets/qrs-logo-full.png',
    headerLogo: '/assets/qrs-logo-header.png',
    mark: '/assets/qrs-mark.png',
    favicon: '/assets/favicon.ico',
    email: 'hello@quantareach.solutions',
    phoneDisplay: '+880 1983-398333',
    phoneHref: 'tel:+8801983398333',
    whatsappHref: 'https://wa.me/8801983398333',
    location: 'Dhaka, Bangladesh',
    businessHours: 'Saturday - Thursday (10:00 AM - 07:00 PM)',
};
export const getSiteUrl = () => {
    const configured = getEnvVar('VITE_SITE_URL');
    if (configured)
        return configured.replace(/\/$/, '');
    if (typeof window !== 'undefined')
        return window.location.origin;
    return '';
};
