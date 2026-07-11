import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// রুট কন্টেইনার
import App from './App';

// পাবলিক এবং অ্যাডমিন লেআউট র্যাপার
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout'; // নতুন লেআউট ইম্পোর্ট

// প্রটেক্টেড রাউট সিকিউরিটি গার্ড
import { ProtectedRoute } from '../components/common/ProtectedRoute';

/**
 * PERFORMANCE OPTIMIZATION: ROUTE-LEVEL CODE SPLITTING
 * প্রতিটি পাবলিক এবং অ্যাডমিন পেজ ডাইনামিকালি (Lazy Loading) লোড হবে
 */
const HomePage = React.lazy(() => import('../pages/public/HomePage').then(module => ({ default: module.HomePage })));
const AboutPage = React.lazy(() => import('../pages/public/AboutPage').then(module => ({ default: module.AboutPage })));
const ServicesPage = React.lazy(() => import('../pages/public/ServicesPage').then(module => ({ default: module.ServicesPage })));
const PortfolioPage = React.lazy(() => import('../pages/public/PortfolioPage').then(module => ({ default: module.PortfolioPage })));
const ContactPage = React.lazy(() => import('../pages/public/ContactPage').then(module => ({ default: module.ContactPage })));
const RequestQuotePage = React.lazy(() => import('../pages/public/RequestQuotePage').then(module => ({ default: module.RequestQuotePage })));
const PricingPage = React.lazy(() => import('../pages/public/PricingPage').then(module => ({ default: module.PricingPage })));
const BlogPage = React.lazy(() => import('../pages/public/BlogPage').then(module => ({ default: module.BlogPage })));
const LegalPage = React.lazy(() => import('../pages/public/LegalPage').then(module => ({ default: module.LegalPage })));
const NotFoundPage = React.lazy(() => import('../pages/public/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

// ড্যাশবোর্ড পেজসমূহ (Lazy Loading)
const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const ClientDashboard = React.lazy(() => import('../pages/client/ClientDashboard').then(module => ({ default: module.ClientDashboard })));

// লগইন ও পাসওয়ার্ড রিকভারি পেজ (Lazy Loading)
const LoginPage = React.lazy(() => import('../pages/public/LoginPage').then(module => ({ default: module.LoginPage })));

// নতুন অ্যাডমিন ম্যানেজমেন্ট পেজসমূহ (Lazy Loading)
const InquiriesPage = React.lazy(() => import('../pages/admin/InquiriesPage').then(module => ({ default: module.InquiriesPage })));
const MeetingRequestsPage = React.lazy(() => import('../pages/admin/MeetingRequestsPage').then(module => ({ default: module.MeetingRequestsPage })));
const ServicesManagerPage = React.lazy(() => import('../pages/admin/ServicesManagerPage').then(module => ({ default: module.ServicesManagerPage })));
const PortfolioManagerPage = React.lazy(() => import('../pages/admin/PortfolioManagerPage').then(module => ({ default: module.PortfolioManagerPage })));
const PricingManagerPage = React.lazy(() => import('../pages/admin/PricingManagerPage').then(module => ({ default: module.PricingManagerPage })));
const BlogManagerPage = React.lazy(() => import('../pages/admin/BlogManagerPage').then(module => ({ default: module.BlogManagerPage })));
const TestimonialsManagerPage = React.lazy(() => import('../pages/admin/TestimonialsManagerPage').then(module => ({ default: module.TestimonialsManagerPage })));
const TeamManagerPage = React.lazy(() => import('../pages/admin/TeamManagerPage').then(module => ({ default: module.TeamManagerPage })));
const TargetsPage = React.lazy(() => import('../pages/admin/TargetsPage').then(module => ({ default: module.TargetsPage })));
const MediaLibraryPage = React.lazy(() => import('../pages/admin/MediaLibraryPage').then(module => ({ default: module.MediaLibraryPage })));
const UsersPage = React.lazy(() => import('../pages/admin/UsersPage').then(module => ({ default: module.UsersPage })));
const LegalPagesManagerPage = React.lazy(() => import('../pages/admin/LegalPagesManagerPage').then(module => ({ default: module.LegalPagesManagerPage })));
const WebsiteSettingsPage = React.lazy(() => import('../pages/admin/WebsiteSettingsPage').then(module => ({ default: module.WebsiteSettingsPage })));

/**
 * ROUTE SUSPENSE FALLBACK
 */
const RouteSuspenseFallback = () => (
  <div className="fixed inset-0 w-full h-full bg-[#071426] -z-10" />
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      // ১. পাবলিক সাইট রাউটস (পাবলিক লেআউট হেডার ও ফুটার সহ)
      {
        element: <PublicLayout />, 
        children: [
          {
            path: '',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <HomePage />
              </Suspense>
            ),
          },
          {
            path: 'about',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <AboutPage />
              </Suspense>
            ),
          },
          {
            path: 'services',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <ServicesPage />
              </Suspense>
            ),
          },
          {
            path: 'portfolio',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <PortfolioPage />
              </Suspense>
            ),
          },
          {
            path: 'contact',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <ContactPage />
              </Suspense>
            ),
          },
          {
            path: 'pricing',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <PricingPage />
              </Suspense>
            ),
          },
          {
            path: 'request-quote',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <RequestQuotePage />
              </Suspense>
            ),
          },
          {
            path: 'blog',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <BlogPage />
              </Suspense>
            ),
          },
          {
            path: 'legal/:type',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <LegalPage />
              </Suspense>
            ),
          },
        ],
      },
      
      // ২. লগইন ও পাসওয়ার্ড পুনরুদ্ধার রাউট (পাবলিক লেআউট ছাড়া)
      {
        path: 'login',
        element: (
          <Suspense fallback={<RouteSuspenseFallback />}>
            <LoginPage />
          </Suspense>
        ),
      },
      
      // ৩. সুরক্ষিত এবং ডাইনামিক অ্যাডমিন প্যানেল রাউট গ্রুপ (গ্লোবাল AdminLayout এর আন্ডারে)
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['super-admin', 'admin', 'editor']}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <AdminDashboard />
              </Suspense>
            ),
          },
          {
            path: 'inquiries',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <InquiriesPage />
              </Suspense>
            ),
          },
          {
            path: 'meetings',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <MeetingRequestsPage />
              </Suspense>
            ),
          },
          {
            path: 'services',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <ServicesManagerPage />
              </Suspense>
            ),
          },
          {
            path: 'portfolio',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <PortfolioManagerPage />
              </Suspense>
            ),
          },
          {
            path: 'pricing',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <PricingManagerPage />
              </Suspense>
            ),
          },
          {
            path: 'blog',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <BlogManagerPage />
              </Suspense>
            ),
          },
          {
            path: 'testimonials',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <TestimonialsManagerPage />
              </Suspense>
            ),
          },
          {
            path: 'team',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <TeamManagerPage />
              </Suspense>
            ),
          },
          {
            path: 'targets',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <TargetsPage />
              </Suspense>
            ),
          },
          {
            path: 'media',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <MediaLibraryPage />
              </Suspense>
            ),
          },
          {
            path: 'users',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <UsersPage />
              </Suspense>
            ),
          },
          {
            path: 'legal-pages',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <LegalPagesManagerPage />
              </Suspense>
            ),
          },
          {
            path: 'settings',
            element: (
              <Suspense fallback={<RouteSuspenseFallback />}>
                <WebsiteSettingsPage />
              </Suspense>
            ),
          },
        ]
      },

      // ৪. সুরক্ষিত ক্লায়েন্ট প্যানেল রাউট (পাবলিক লেআউট ছাড়া এবং রোল-ভেরিফাইড)
      {
        path: 'client/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['client', 'super-admin', 'admin']}>
            <Suspense fallback={<RouteSuspenseFallback />}>
              <ClientDashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      // ৫. ৪০৪ নট ফাউন্ড রাউট
      {
        path: '*',
        element: (
          <Suspense fallback={<RouteSuspenseFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
] as any, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }
} as any);