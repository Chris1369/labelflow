import { Alert } from 'react-native';
import { errorHandler } from './errorHandler';

type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>;

interface SafeActionOptions {
  showAlert?: boolean;
  alertTitle?: string;
  alertMessage?: string;
  onError?: (error: any) => void;
  componentName?: string;
}

export function createSafeAction<T extends any[], R>(
  fn: AsyncFunction<T, R>,
  options: SafeActionOptions = {}
): AsyncFunction<T, R | undefined> {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Log error
      errorHandler.logError({
        type: 'render',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        context: {
          functionName: fn.name,
          componentName: options.componentName,
          args,
        },
      });

      // Handle error
      if (options.onError) {
        options.onError(error);
      }

      // Show alert if requested
      if (options.showAlert !== false) {
        const title = options.alertTitle || 'Erreur';
        const message = options.alertMessage || 
          (error instanceof Error ? error.message : 'Une erreur s\'est produite');
        
        Alert.alert(title, message);
      }

      return undefined;
    }
  };
}

// Helper to wrap all actions in an object
export function wrapActionsWithSafeAction<T extends Record<string, AsyncFunction<any, any>>>(
  actions: T,
  defaultOptions: SafeActionOptions = {}
): T {
  const wrappedActions = {} as T;
  
  for (const [key, fn] of Object.entries(actions)) {
    if (typeof fn === 'function') {
      wrappedActions[key as keyof T] = createSafeAction(
        fn,
        { ...defaultOptions, componentName: `${defaultOptions.componentName}.${key}` }
      ) as T[keyof T];
    } else {
      wrappedActions[key as keyof T] = fn;
    }
  }
  
  return wrappedActions;
}