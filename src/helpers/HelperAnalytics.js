export const MEASUREMENT_ID = "G-BXGJZQS44R";

export const initGoogleAnalytics = () => {
    if (window.gtag) return; // evitar duplicar carga

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
        window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID);
};

export const trackPageView = (url) => {
    if (!window.gtag) return;
    window.gtag("config", MEASUREMENT_ID, { page_path: url });
};

export const trackEvent = ({ action, category, label, value }) => {
    if (!window.gtag) return;
    window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};
