import {AxiosError} from "axios";
import {Alert, AlertButton, AlertOptions} from "react-native";

/**
 * Valide les données d'un formulaire avec Zod et retourne le premier message d'erreur.
 *
 * @param schema - Schéma de validation Zod
 * @param data - Données à valider
 * @returns Objet contenant success (boolean) et data/error
 *
 * @example
 * const result = validateFormData(signInSchema, { email, password });
 * if (!result.success) {
 *   Alert.alert('', result.error);
 *   return;
 * }
 */
export function validateFormData<T>(
    schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: { issues: { message?: string }[] } } },
    data: unknown
): { success: true; data: T } | { success: false; error: string } {
    const parsedData = schema.safeParse(data);

    if (!parsedData.success) {
        const firstError = parsedData.error?.issues[0]?.message;
        return {
            success: false,
            error: firstError || 'Une erreur inconnue est survenue lors de la validation des données.'
        };
    }

    return {
        success: true,
        data: parsedData.data as T
    };
}

/**
 * Convertit un Blob en Uint8Array.
 *
 * @param blob
 * @returns Le Uint8Array
 */
export const blobToUint8Array = (blob: Blob): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => {
            reject(new Error("Échec de la lecture du Blob"));
        };

        reader.onload = () => {
            if (reader.result) {
                resolve(new Uint8Array(reader.result as ArrayBuffer));
            } else {
                reject(new Error("Le résultat du FileReader est vide"));
            }
        };

        reader.readAsArrayBuffer(blob);
    });
};

export function processAxiosError(error: unknown, defaultMessage: string, buttons?: AlertButton[], options?: AlertOptions) {
    let message = defaultMessage;
    if (error instanceof AxiosError ) {
        if (error.response?.data?.message && typeof error.response.data.message === 'string') {
            message = error.response.data.message;
        } else if (error.response?.data?.message && Array.isArray(error.response.data.message) && error.response.data.message.length > 0 && typeof error.response.data.message[0] === 'string') {
            message = error.response.data.message[0];
        }
    }
    Alert.alert('Erreur', message, buttons, options);
}