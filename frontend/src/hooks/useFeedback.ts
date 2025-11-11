import { useState, useCallback } from 'react';

export interface FeedbackState {
  isLoading: boolean;
  success: string | null;
  error: string | null;
  rateLimitSeconds: number | null;
}

export const useFeedback = () => {
  const [state, setState] = useState<FeedbackState>({
    isLoading: false,
    success: null,
    error: null,
    rateLimitSeconds: null
  });

  const setLoading = useCallback((loading: boolean, message?: string) => {
    setState(prev => ({
      ...prev,
      isLoading: loading,
      success: loading ? null : prev.success,
      error: loading ? null : prev.error
    }));
  }, []);

  const setSuccess = useCallback((message: string) => {
    setState({
      isLoading: false,
      success: message,
      error: null,
      rateLimitSeconds: null
    });
  }, []);

  const setError = useCallback((message: string) => {
    setState({
      isLoading: false,
      success: null,
      error: message,
      rateLimitSeconds: null
    });
  }, []);

  const setRateLimit = useCallback((seconds: number) => {
    setState({
      isLoading: false,
      success: null,
      error: null,
      rateLimitSeconds: seconds
    });
  }, []);

  const clearFeedback = useCallback(() => {
    setState({
      isLoading: false,
      success: null,
      error: null,
      rateLimitSeconds: null
    });
  }, []);

  return {
    ...state,
    setLoading,
    setSuccess,
    setError,
    setRateLimit,
    clearFeedback
  };
};
