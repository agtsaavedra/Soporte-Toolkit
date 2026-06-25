import { useEffect, useState } from "react";
import {
  readStoredSession,
  saveSessionFromCallbackUrl,
  signIn,
  signOut,
  signUp,
} from "../services/solutionsRepository";

// Encapsula Supabase Auth y los callbacks que llegan por hash o protocolo Electron.
export const useAuthSession = ({ showToast }) => {
  const [authSession, setAuthSession] = useState(readStoredSession);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const handleAuthCallback = async (url) => {
      try {
        const session = await saveSessionFromCallbackUrl(url);
        if (!session) return;

        setAuthSession(session);
        showToast("Email confirmado. Sesión iniciada.");
      } catch {
        showToast("No se pudo completar el callback de autenticación");
      }
    };

    if (window.location.hash.includes("access_token")) {
      handleAuthCallback(window.location.href);
      window.history.replaceState({}, "", window.location.pathname);
    }

    window.soporteToolkit?.onAuthCallback?.(handleAuthCallback);
  }, [showToast]);

  const updateAuthForm = (field, value) => {
    setAuthForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleAuthSubmit = async (mode) => {
    try {
      const session =
        mode === "signup" ? await signUp(authForm) : await signIn(authForm);

      setAuthSession(session);
      if (session.access_token) {
        showToast(mode === "signup" ? "Usuario creado" : "Sesión iniciada");
      } else {
        showToast("Usuario creado. Confirma el email antes de entrar.");
      }
    } catch {
      showToast("No se pudo completar la autenticación");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setAuthSession(null);
    showToast("Sesión cerrada");
  };

  return {
    authForm,
    authSession,
    handleAuthSubmit,
    handleSignOut,
    setAuthSession,
    updateAuthForm,
  };
};
