import React, { useEffect, useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import jwtDecode from "jwt-decode";

import Profile from "./pages/Profile.jsx";
import Services from "./pages/Services.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  const {
    state,
    signIn,
    signOut,
    getBasicUserInfo,
    getIDToken,
    getAccessToken,
  } = useAuthContext();

  const [userInfo, setUserInfo] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      if (state?.isAuthenticated) {
        try {
          const basicInfo = await getBasicUserInfo();
          setUserInfo(basicInfo);
          console.log("✅ Basic user info:", basicInfo);

          const idToken = await getIDToken();
          console.log("🔑 Raw ID Token:", idToken);

          const fetchedAccessToken = await getAccessToken();
          setAccessToken(fetchedAccessToken);
          console.log("🔐 Access Token:", fetchedAccessToken);

          try {
            const decodedAccessToken = jwtDecode(fetchedAccessToken);
            console.log("📜 Decoded Access Token:", decodedAccessToken);
          } catch (decodeErr) {
            console.error("❌ Failed to decode access token:", decodeErr);
          }

          if (idToken) {
            const decoded = jwtDecode(idToken);
            console.log("🧾 Decoded ID Token:", decoded);

            const rolesClaim = decoded.roles || decoded.role || [];
            if (Array.isArray(rolesClaim)) {
              setUserRoles(rolesClaim);
            } else if (rolesClaim) {
              setUserRoles([rolesClaim]);
            } else {
              setUserRoles([]);
            }
          } else {
            setUserRoles([]);
          }
        } catch (error) {
          console.error("❌ Error fetching user info or token", error);
          setUserInfo(null);
          setUserRoles([]);
          setAccessToken(null);
        }
      } else {
        setUserInfo(null);
        setUserRoles([]);
        setAccessToken(null);
      }
    }

    fetchUserData();
  }, [state?.isAuthenticated]);

  if (!state?.isAuthenticated) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>LocalLink</h1>
        <p>Welcome! Please login to continue.</p>
        <button onClick={() => signIn()}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>LocalLink</h1>

      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/profile">Profile</Link> |{" "}
        <Link to="/services">Services</Link> |{" "}
        {userRoles.includes("service_provider") && (
          <Link to="/dashboard">Dashboard</Link>
        )} |{" "}
        <button onClick={() => signOut()}>Logout</button>
      </nav>

      <Routes>
        <Route
          path="/profile"
          element={<Profile userInfo={userInfo} roles={userRoles} />}
        />
        <Route
          path="/services"
          element={<Services accessToken={accessToken} />}
        />
        <Route
          path="/dashboard"
          element={
            userRoles.includes("service_provider") ? (
              <Dashboard accessToken={accessToken} userId={userInfo?.sub} />
            ) : (
              <p>Access Denied</p>
            )
          }
        />
        <Route
          path="/"
          element={
            <div>
              <p>Welcome back, {userInfo?.given_name || userInfo?.username || "user"}!</p>
              <p><strong>Email:</strong> {userInfo?.email}</p>
              <p><strong>Roles:</strong> {userRoles.join(", ") || "None"}</p>
              <p><strong>Access Token:</strong> {accessToken}</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
