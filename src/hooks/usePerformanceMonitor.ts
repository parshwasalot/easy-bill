import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const currentTime = Date.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;
    
    if (timeSinceLastRender < 16) { // 60fps = 16.67ms per frame
      console.warn(
        `${componentName} rendered too frequently:`,
        `${timeSinceLastRender}ms since last render`
      );
    }

    if (renderCount.current % 10 === 0) {
      console.log(`${componentName} render count:`, renderCount.current);
    }

    lastRenderTime.current = currentTime;
  });
}; 