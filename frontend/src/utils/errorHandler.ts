export interface AppError {
  type: 'network' | 'validation' | 'auth' | 'system' | 'rate_limit';
  title: string;
  message: string;
  code?: string;
  retryable: boolean;
}

export const handleApiError = (error: any): AppError => {
  // Network errors
  if (!error.response) {
    return {
      type: 'network',
      title: 'CONNECTION LOST',
      message: 'Unable to reach the server. Check your connection and try again.',
      retryable: true
    };
  }

  const status = error.response?.status;
  const data = error.response?.data;

  // Rate limiting
  if (status === 429) {
    return {
      type: 'rate_limit',
      title: 'SYSTEM OVERLOAD',
      message: 'Too many requests. Please wait before trying again.',
      retryable: true
    };
  }

  // Authentication errors
  if (status === 401) {
    return {
      type: 'auth',
      title: 'AUTHENTICATION REQUIRED',
      message: 'Please log in to access this feature.',
      retryable: false
    };
  }

  if (status === 403) {
    return {
      type: 'auth',
      title: 'ACCESS DENIED',
      message: 'You do not have permission to perform this action.',
      retryable: false
    };
  }

  // Validation errors
  if (status === 400 || status === 422) {
    return {
      type: 'validation',
      title: 'INVALID INPUT',
      message: data?.error?.message || 'Please check your input and try again.',
      code: data?.error?.code,
      retryable: false
    };
  }

  // Not found
  if (status === 404) {
    return {
      type: 'validation',
      title: 'NOT FOUND',
      message: data?.error?.message || 'The requested resource was not found.',
      retryable: false
    };
  }

  // Server errors
  if (status >= 500) {
    return {
      type: 'system',
      title: 'SYSTEM ERROR',
      message: 'The server encountered an error. Please try again later.',
      retryable: true
    };
  }

  // Generic error
  return {
    type: 'system',
    title: 'ERROR',
    message: data?.error?.message || error.message || 'An unexpected error occurred.',
    retryable: true
  };
};

export const getErrorMessage = (error: AppError): string => {
  return `${error.title}: ${error.message}`;
};
