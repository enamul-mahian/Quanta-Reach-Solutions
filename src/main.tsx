// =========================================================================
// MetaFore Technologies - Main React Entry Point
// =========================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { router } from '@/app/router';

// গ্লোবাল স্টাইল এবং টাইপোগ্রাফি ইমপোর্ট করা হচ্ছে
import '@/styles/globals.css';
import '@/styles/typography.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>
);