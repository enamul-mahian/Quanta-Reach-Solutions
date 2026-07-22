import { jsx as _jsx } from "react/jsx-runtime";
// =========================================================================
// Quanta Reach Solutions - Reusable Container Component
// =========================================================================
import React from 'react';
export const Container = ({ children, className = '', as: Component = 'div' }) => {
    return (_jsx(Component, { className: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${className}`, children: children }));
};
