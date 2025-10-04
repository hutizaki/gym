// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
  }

  // Measure main thread work
  measureMainThreadWork() {
    if (!window.performance || !window.performance.getEntriesByType) return;

    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      this.metrics.firstPaint = this.getFirstPaint();
    }
  }

  // Get First Paint time
  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  // Measure layout thrashing
  measureLayoutThrashing() {
    let layoutCount = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.name.includes('layout')) {
          layoutCount++;
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });
    this.observers.push(observer);

    return () => {
      observer.disconnect();
      return layoutCount;
    };
  }

  // Measure JavaScript execution time
  measureJSTime() {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      return endTime - startTime;
    };
  }

  // Get performance report
  getReport() {
    this.measureMainThreadWork();
    
    return {
      ...this.metrics,
      memory: performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      } : null,
      timing: performance.timing ? {
        domLoading: performance.timing.domLoading,
        domInteractive: performance.timing.domInteractive,
        domContentLoaded: performance.timing.domContentLoadedEventEnd,
        domComplete: performance.timing.domComplete,
        loadComplete: performance.timing.loadEventEnd
      } : null
    };
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-cleanup on page unload
window.addEventListener('beforeunload', () => {
  performanceMonitor.cleanup();
});
