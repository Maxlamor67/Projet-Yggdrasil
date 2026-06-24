import { useEffect } from "react";
import { useError } from "@/contexts/ErrorContext";
import { processAxiosError, logError } from "@/utils/error";

/**
 * Hook personnalisé qui gère automatiquement l'affichage des erreurs pour un useQuery
 * @param query - Le résultat du useQuery
 * @param context - Le contexte pour les logs (ex: "GetProjects")
 * @param defaultErrorMessage - Le message d'erreur par défaut
 */
export function useQueryWithErrorHandling<TData = unknown, TError = unknown>(
  query: any,
  context: string,
  defaultErrorMessage: string
) {
  const { showError } = useError();

  console.log(`[${context}] Query state:`, { isError: query.isError, error: query.error, status: query.status });

  useEffect(() => {
    if (query.isError && query.error) {
      console.log(`[${context}] Error detected!`);
      logError(query.error, context);
      const errorInfo = processAxiosError(
        query.error,
        defaultErrorMessage
      );
      showError(errorInfo);
    }
  }, [query.isError, query.error, context, defaultErrorMessage, showError]);

  return query;
}
