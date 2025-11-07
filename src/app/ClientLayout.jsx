'use client';
import React, {Suspense} from 'react';
import Header from '@/components/common/header/Header';
import Footer from '@/components/common/footer/Footer';
import {ToastContainer} from 'react-toastify';
import {Providers} from '@/app/AuthProvider';
import Matomo from '@/components/matomo/Matomo.jsx';

export default function ClientLayout({children}) {
    return (
        <Providers>
            <Matomo/>
            <Suspense fallback={<div className="h-16"/>}>
                <Header/>
            </Suspense>
            {children}
            <Footer/>
            <ToastContainer/>
        </Providers>
    );
}