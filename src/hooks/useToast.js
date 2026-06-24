import { useCallback, useRef, useState } from "react";

const TOAST_TIMEOUT_MS = 2600;

// Maneja mensajes efimeros de UI y evita timeouts superpuestos.
export const useToast = () => {
  const [toast, setToast] = useState("");
  const timeoutRef = useRef(null);

  const showToast = useCallback((message) => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    setToast(message);
    timeoutRef.current = window.setTimeout(() => {
      setToast("");
      timeoutRef.current = null;
    }, TOAST_TIMEOUT_MS);
  }, []);

  return { toast, showToast };
};
