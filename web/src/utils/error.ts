import axios, { AxiosError } from "axios";

export interface ErrorInfo {
  contextMessage: string; // Message par défaut (contexte)
  message: string; // Message d'erreur de l'API
  status?: number;
  statusText?: string;
  originalError?: unknown;
}

/**
 * Traite les erreurs Axios et autres erreurs possibles
 * @param error - L'erreur à traiter
 * @param defaultMessage - Le message par défaut si l'erreur est inconnue
 * @returns Un objet ErrorInfo avec le message et les détails de l'erreur
 */
export function processAxiosError(
  error: unknown,
  defaultMessage: string
): ErrorInfo {
  let apiMessage = defaultMessage;
  let status: number | undefined;
  let statusText: string | undefined;

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Extraire le statut HTTP
    status = axiosError.response?.status;
    statusText = axiosError.response?.statusText;

    // Essayer de récupérer le message depuis la réponse
    if (axiosError.response?.data) {
      const data = axiosError.response.data as any;
      if (data.message) {
        apiMessage = data.message;
      } else if (data.error) {
        apiMessage = data.error;
      }
    }

    // Gérer les erreurs spécifiques par statut
    if (status === 404) {
      apiMessage = apiMessage || "Ressource non trouvée";
    } else if (status === 401) {
      apiMessage = apiMessage || "Non authentifié. Veuillez vous reconnecter.";
    } else if (status === 403) {
      apiMessage = apiMessage || "Vous n'avez pas les permissions pour effectuer cette action";
    } else if (status === 400) {
      apiMessage = apiMessage || "Données invalides";
    } else if (status === 500) {
      apiMessage = apiMessage || "Erreur serveur. Veuillez réessayer plus tard.";
    } else if (!apiMessage || apiMessage === defaultMessage) {
      // Si pas de message spécifique trouvé, utiliser le message du statut ou par défaut
      if (statusText) {
        apiMessage = `Erreur: ${statusText}`;
      }
    }
  } else if (error instanceof Error) {
    // Erreur JavaScript standard
    apiMessage = error.message || defaultMessage;
  } else if (typeof error === "string") {
    apiMessage = error;
  }

  return {
    contextMessage: defaultMessage,
    message: apiMessage,
    status,
    statusText,
    originalError: error,
  };
}

/**
 * Log les erreurs pour le debugging
 */
export function logError(error: unknown, context?: string) {
  console.error(`[Error${context ? ` - ${context}` : ""}]`, error);
}
