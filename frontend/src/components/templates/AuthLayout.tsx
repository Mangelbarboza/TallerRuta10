import type { ReactNode } from "react";

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #161A59, #0F1240)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      {children}
    </div>
  );
};