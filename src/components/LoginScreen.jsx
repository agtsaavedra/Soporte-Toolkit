// Pantalla de acceso inicial. Mantiene el formulario aislado del layout principal
// para que App.jsx solo coordine autenticacion y estado global.
const LoginScreen = ({ authForm, onAuthSubmit, onUpdateAuthForm, toast }) => (
  <main className="login-screen">
    <section className="login-card">
      <img className="login-icon" src="/toolkit-icon.svg" alt="" />
      <p className="eyebrow">Soporte Toolkit</p>
      <h1>Acceso requerido</h1>
      <p>
        Inicia sesion para consultar, editar y sincronizar la base de
        soluciones.
      </p>

      <div className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={authForm.email}
          onChange={(event) => onUpdateAuthForm("email", event.target.value)}
        />
        <input
          type="password"
          placeholder="Contrasena"
          value={authForm.password}
          onChange={(event) => onUpdateAuthForm("password", event.target.value)}
        />
        <div>
          <button onClick={() => onAuthSubmit("signin")}>Entrar</button>
          <button className="secondary-login" onClick={() => onAuthSubmit("signup")}>
            Crear usuario
          </button>
        </div>
      </div>
    </section>

    {toast && <div className="toast-message">{toast}</div>}
  </main>
);

export default LoginScreen;
