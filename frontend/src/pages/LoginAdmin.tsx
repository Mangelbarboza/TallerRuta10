import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/templates/AuthLayout";
import Logo from "../components/atoms/icons/logoRuta10.svg?react";

const colors = {
  primaryRed: "#F21D2F",
  darkBlue: "#161A59",
};

export const LoginAdmin = () => {
  const navigate = useNavigate();

  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!emailOrUser || !password) {
      setErrorMsg("Debes completar usuario/correo y contraseña.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7265/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: emailOrUser,
          password: password,
        }),
      });

      // Si falla, intenta leer el mensaje del backend (401 normalmente)
      if (!response.ok) {
        let backendMessage = "Login fallido";
        try {
          const err = await response.json();
          if (err?.message) backendMessage = err.message;
        } catch {
          // si no es JSON, ignoramos
        }
        setErrorMsg(backendMessage);
        return;
      }

      const data = await response.json();
      const token = data?.token as string | undefined;
      const expiration = data?.expiration as string | undefined;

      if (!token) {
        setErrorMsg("El servidor no devolvió el token.");
        return;
      }

      // Guardar token y expiración
      localStorage.setItem("jwt", token);
      if (expiration) localStorage.setItem("jwt_expiration", expiration);

      // Compatibilidad con el guard viejo (si existe)
      localStorage.setItem("adminAuth", "true");

      navigate("/admin");
    } catch (error) {
      console.error("Error de autenticación:", error);
      setErrorMsg("No se pudo conectar con el servidor.");
    }
  };

  return (
    <AuthLayout>
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <Logo width="70" height="70" />
          <h2 style={{ marginTop: "10px", color: colors.darkBlue }}>
            Panel Administrativo
          </h2>
        </div>

        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <input
            type="text"
            placeholder="Usuario o correo administrativo"
            required
            value={emailOrUser}
            onChange={(e) => setEmailOrUser(e.target.value)}
            autoComplete="username"
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={inputStyle}
          />

          {errorMsg && (
            <div
              style={{
                backgroundColor: "#ffe7e7",
                border: "1px solid #ffc1c1",
                color: "#9b1c1c",
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              {errorMsg}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                flex: 1,
                backgroundColor: "white",
                color: colors.darkBlue,
                border: "1px solid #ddd",
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: colors.primaryRed,
                color: "white",
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Ingresar
            </button>
          </div>

          <div
            style={{
              marginTop: "12px",
              padding: "10px 12px",
              backgroundColor: "#f8fafc",
              border: "1px dashed #cbd5e1",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#475569",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>Acceso rápido:</strong> <code>admin</code> / <code>Admin123!</code>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmailOrUser("admin");
                setPassword("Admin123!");
              }}
              style={{
                backgroundColor: colors.darkBlue,
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Autocompletar
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

const inputStyle: React.CSSProperties = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "14px",
};