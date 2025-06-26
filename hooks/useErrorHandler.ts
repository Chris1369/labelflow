import { useCallback } from 'react';
import { errorHandler } from '@/helpers/errorHandler';

export const useErrorHandler = (componentName?: string) => {
  const handleError = useCallback((error: any, context?: any) => {
    errorHandler.handleRenderError(error, componentName);
    console.error(`Error in ${componentName}:`, error, context);
  }, [componentName]);

  const wrapAsync = useCallback(<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context?: any
  ): T => {
    return errorHandler.wrapAsync(fn, 'render', { componentName, ...context });
  }, [componentName]);

  return {
    handleError,
    wrapAsync,
  };
};