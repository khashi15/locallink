import React, { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";

const TokenDisplay = () => {
  const { getAccessToken, state } = useAuthContext();
  const [token, setToken] = useState("");

  useEffect(() => {
    getAccessToken().then(setToken);
  }, []);

  return (
    <div style={{ padding: "1rem", background: "#f0f0f0", borderRadius: "8px" }}>
      <h3>🔑 Access Token (For Testing)</h3>
      {state.isAuthenticated ? (
        <pre
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            background: "#fff",
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          {token}
        </pre>
      ) : (
        <p>Not Logged In</p>
      )}
    </div>
  );
};

export default TokenDisplay;