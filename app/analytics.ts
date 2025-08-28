// Performance monitoring and analytics
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    // Send to analytics service
    console.log('Web Vital:', metric);

    // You can send to Google Analytics, Vercel Analytics, or any other service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }
  }
}

// Core Web Vitals thresholds
export const webVitalsThresholds = {
  LCP: 2500, // Largest Contentful Paint (2.5s)
  FID: 100,  // First Input Delay (100ms)
  CLS: 0.1,  // Cumulative Layout Shift (0.1)
  FCP: 1800, // First Contentful Paint (1.8s)
  TTFB: 800, // Time to First Byte (800ms)
};

// Performance monitoring
export function monitorPerformance() {
  if (typeof window !== 'undefined') {
    // Monitor Core Web Vitals - Updated for web-vitals v5
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
      onCLS(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
    });
  }
}
