"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export interface DisplayErrorProps {
  contextMessage?: string; // Message de contexte (optionnel)
  message: string;
  status?: number;
  onClose?: () => void;
  autoCloseDuration?: number;
}

/**
 * Composant pour afficher une erreur API avec gestion auto-close
 */
export function ErrorDisplay({
  contextMessage,
  message,
  status,
  onClose,
  autoCloseDuration = 5000,
}: DisplayErrorProps) {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    if (autoCloseDuration && autoCloseDuration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [autoCloseDuration]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[100000] w-full max-w-md">
      <Alert variant="destructive" className="border border-destructive">
        <AlertCircle className="h-4 w-4 mt-0.5" />
        <div className="flex-1 ml-2">
          {contextMessage && (
            <AlertDescription className="font-semibold mb-1">
              {contextMessage}
            </AlertDescription>
          )}
          <AlertDescription>{message}</AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  );
}
