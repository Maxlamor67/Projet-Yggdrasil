"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { ErrorInfo } from "@/utils/error";
import { ErrorDisplay } from "@/components/error-display/ErrorDisplay";

interface ErrorContextType {
  error: ErrorInfo | null;
  showError: (error: ErrorInfo) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<ErrorInfo | null>(null);

  const showError = useCallback((errorInfo: ErrorInfo) => {
    setError(errorInfo);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
      {error && (
        <ErrorDisplay
          contextMessage={error.contextMessage}
          message={error.message}
          status={error.status}
          onClose={clearError}
          autoCloseDuration={5000}
        />
      )}
    </ErrorContext.Provider>
  );
}

/**
 * Hook pour accéder au contexte des erreurs
 */
export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error(
      "useError doit être utilisé dans un ErrorProvider. " +
      "Assurez-vous que ErrorProvider enveloppe le composant dans main.tsx ou App.tsx"
    );
  }
  return context;
}
