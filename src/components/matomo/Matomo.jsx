'use client';
import {useEffect} from 'react';

const Matomo = () => {

    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') return;

        const u = '//matomo.leoderoin.fr/';
        window._paq = window._paq || [];
        window._paq.push(['trackPageView']);
        window._paq.push(['enableLinkTracking']);
        window._paq.push(['setTrackerUrl', u + 'matomo.php']);
        window._paq.push(['setSiteId', '1']);

        const s = document.createElement('script');
        s.async = true;
        s.src = u + 'matomo.js';
        document.head.appendChild(s);

        return () => {
            if (s.parentNode) s.parentNode.removeChild(s);
        };
    }, []);

    return null;
}

export default Matomo;