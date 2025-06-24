import React, { memo, ComponentType } from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

export function withPerformanceOptimization<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string
) {
  const WithPerformanceOptimization = (props: P) => {
    usePerformanceMonitor(componentName);

    return <WrappedComponent {...props} />;
  };

  WithPerformanceOptimization.displayName = `WithPerformanceOptimization(${componentName})`;

  return memo(WithPerformanceOptimization);
} 