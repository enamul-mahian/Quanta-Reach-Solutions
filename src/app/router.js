import { jsx as _jsx } from "react/jsx-runtime";
import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '/src/app/App.js';
import { AdminLayout } from '/src/components/layout/AdminLayout.js';
import { ProtectedRoute } from '/src/components/common/ProtectedRoute.js';
import { PublicLayout } from '/src/components/layout/PublicLayout.js';
const HomePage = React.lazy(() => import('/src/pages/public/HomePage.js').then((module) => ({ default: module.HomePage })));
const AboutPage = React.lazy(() => import('/src/pages/public/AboutPage.js').then((module) => ({ default: module.AboutPage })));
const ServicesPage = React.lazy(() => import('/src/pages/public/ServicesPage.js').then((module) => ({ default: module.ServicesPage })));
const ServiceDetailPage = React.lazy(() => import('/src/pages/public/ServiceDetailPage.js').then((module) => ({ default: module.ServiceDetailPage })));
const PortfolioPage = React.lazy(() => import('/src/pages/public/PortfolioPage.js').then((module) => ({ default: module.PortfolioPage })));
const PortfolioDetailPage = React.lazy(() => import('/src/pages/public/PortfolioDetailPage.js').then((module) => ({ default: module.PortfolioDetailPage })));
const ContactPage = React.lazy(() => import('/src/pages/public/ContactPage.js').then((module) => ({ default: module.ContactPage })));
const RequestQuotePage = React.lazy(() => import('/src/pages/public/RequestQuotePage.js').then((module) => ({ default: module.RequestQuotePage })));
const PricingPage = React.lazy(() => import('/src/pages/public/PricingPage.js').then((module) => ({ default: module.PricingPage })));
const BlogPage = React.lazy(() => import('/src/pages/public/BlogPage.js').then((module) => ({ default: module.BlogPage })));
const BlogDetailPage = React.lazy(() => import('/src/pages/public/BlogDetailPage.js').then((module) => ({ default: module.BlogDetailPage })));
const LegalPage = React.lazy(() => import('/src/pages/public/LegalPage.js').then((module) => ({ default: module.LegalPage })));
const NotFoundPage = React.lazy(() => import('/src/pages/public/NotFoundPage.js').then((module) => ({ default: module.NotFoundPage })));
const LoginPage = React.lazy(() => import('/src/pages/public/LoginPage.js').then((module) => ({ default: module.LoginPage })));
const AdminDashboard = React.lazy(() => import('/src/pages/admin/AdminDashboard.js').then((module) => ({ default: module.AdminDashboard })));
const ClientDashboard = React.lazy(() => import('/src/pages/client/ClientDashboard.js').then((module) => ({ default: module.ClientDashboard })));
const InquiriesPage = React.lazy(() => import('/src/pages/admin/InquiriesPage.js').then((module) => ({ default: module.InquiriesPage })));
const MeetingRequestsPage = React.lazy(() => import('/src/pages/admin/MeetingRequestsPage.js').then((module) => ({ default: module.MeetingRequestsPage })));
const ServicesManagerPage = React.lazy(() => import('/src/pages/admin/ServicesManagerPage.js').then((module) => ({ default: module.ServicesManagerPage })));
const PortfolioManagerPage = React.lazy(() => import('/src/pages/admin/PortfolioManagerPage.js').then((module) => ({ default: module.PortfolioManagerPage })));
const PricingManagerPage = React.lazy(() => import('/src/pages/admin/PricingManagerPage.js').then((module) => ({ default: module.PricingManagerPage })));
const BlogManagerPage = React.lazy(() => import('/src/pages/admin/BlogManagerPage.js').then((module) => ({ default: module.BlogManagerPage })));
const TestimonialsManagerPage = React.lazy(() => import('/src/pages/admin/TestimonialsManagerPage.js').then((module) => ({ default: module.TestimonialsManagerPage })));
const TeamManagerPage = React.lazy(() => import('/src/pages/admin/TeamManagerPage.js').then((module) => ({ default: module.TeamManagerPage })));
const TargetsPage = React.lazy(() => import('/src/pages/admin/TargetsPage.js').then((module) => ({ default: module.TargetsPage })));
const MediaLibraryPage = React.lazy(() => import('/src/pages/admin/MediaLibraryPage.js').then((module) => ({ default: module.MediaLibraryPage })));
const UsersPage = React.lazy(() => import('/src/pages/admin/UsersPage.js').then((module) => ({ default: module.UsersPage })));
const LegalPagesManagerPage = React.lazy(() => import('/src/pages/admin/LegalPagesManagerPage.js').then((module) => ({ default: module.LegalPagesManagerPage })));
const WebsiteSettingsPage = React.lazy(() => import('/src/pages/admin/WebsiteSettingsPage.js').then((module) => ({ default: module.WebsiteSettingsPage })));
const RouteSuspenseFallback = () => (_jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center bg-[#071426]", role: "status", "aria-label": "Loading page", children: _jsx("div", { className: "h-11 w-11 animate-spin rounded-full border-2 border-[#168BFF]/20 border-t-[#168BFF]" }) }));
const lazyPage = (page) => _jsx(Suspense, { fallback: _jsx(RouteSuspenseFallback, {}), children: page });
const guardedPage = (page, roles) => (_jsx(ProtectedRoute, { allowedRoles: roles, children: lazyPage(page) }));
const adminRoles = ['super-admin', 'admin', 'editor'];
const managerRoles = ['super-admin', 'admin'];
export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(App, {}),
        children: [
            {
                element: _jsx(PublicLayout, {}),
                children: [
                    { index: true, element: lazyPage(_jsx(HomePage, {})) },
                    { path: 'about', element: lazyPage(_jsx(AboutPage, {})) },
                    { path: 'services', element: lazyPage(_jsx(ServicesPage, {})) },
                    { path: 'services/:serviceId', element: lazyPage(_jsx(ServiceDetailPage, {})) },
                    { path: 'portfolio', element: lazyPage(_jsx(PortfolioPage, {})) },
                    { path: 'portfolio/:slug', element: lazyPage(_jsx(PortfolioDetailPage, {})) },
                    { path: 'pricing', element: lazyPage(_jsx(PricingPage, {})) },
                    { path: 'blog', element: lazyPage(_jsx(BlogPage, {})) },
                    { path: 'blog/:slug', element: lazyPage(_jsx(BlogDetailPage, {})) },
                    { path: 'contact', element: lazyPage(_jsx(ContactPage, {})) },
                    { path: 'request-quote', element: lazyPage(_jsx(RequestQuotePage, {})) },
                    { path: 'legal/:type', element: lazyPage(_jsx(LegalPage, {})) },
                ],
            },
            { path: 'login', element: lazyPage(_jsx(LoginPage, {})) },
            {
                path: 'admin',
                element: _jsx(ProtectedRoute, { allowedRoles: adminRoles, children: _jsx(AdminLayout, {}) }),
                children: [
                    { index: true, element: _jsx(Navigate, { to: "dashboard", replace: true }) },
                    { path: 'dashboard', element: lazyPage(_jsx(AdminDashboard, {})) },
                    { path: 'inquiries', element: lazyPage(_jsx(InquiriesPage, {})) },
                    { path: 'meetings', element: lazyPage(_jsx(MeetingRequestsPage, {})) },
                    { path: 'services', element: lazyPage(_jsx(ServicesManagerPage, {})) },
                    { path: 'portfolio', element: lazyPage(_jsx(PortfolioManagerPage, {})) },
                    { path: 'pricing', element: lazyPage(_jsx(PricingManagerPage, {})) },
                    { path: 'blog', element: lazyPage(_jsx(BlogManagerPage, {})) },
                    { path: 'testimonials', element: lazyPage(_jsx(TestimonialsManagerPage, {})) },
                    { path: 'team', element: lazyPage(_jsx(TeamManagerPage, {})) },
                    { path: 'legal-pages', element: lazyPage(_jsx(LegalPagesManagerPage, {})) },
                    { path: 'media', element: guardedPage(_jsx(MediaLibraryPage, {}), managerRoles) },
                    { path: 'targets', element: guardedPage(_jsx(TargetsPage, {}), managerRoles) },
                    { path: 'settings', element: guardedPage(_jsx(WebsiteSettingsPage, {}), managerRoles) },
                    { path: 'users', element: guardedPage(_jsx(UsersPage, {}), ['super-admin']) },
                ],
            },
            {
                path: 'client/dashboard',
                element: guardedPage(_jsx(ClientDashboard, {}), ['client', 'super-admin', 'admin']),
            },
            { path: '*', element: lazyPage(_jsx(NotFoundPage, {})) },
        ],
    },
]);
