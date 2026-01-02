/**
 * Extract error message from API error response
 */
export const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { error?: string } } };
    return axiosError.response?.data?.error || defaultMessage;
  }
  return defaultMessage;
};
