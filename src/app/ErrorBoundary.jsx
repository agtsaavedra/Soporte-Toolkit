import { Component } from "react";
import { ErrorState } from "../shared/ui/StateBlock";

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Error no controlado en la aplicacion", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="login-screen">
          <section className="login-card">
            <ErrorState
              title="La aplicacion encontro un problema"
              description="Reinicia la app. Si vuelve a ocurrir, revisa la consola o reporta el ultimo flujo realizado."
            />
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
