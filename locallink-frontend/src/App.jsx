import React, { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import jwtDecode from "jwt-decode";

function App() {
  const { state, signIn, signOut, getBasicUserInfo, getIDToken, getAccessToken } =
    useAuthContext();

  const [userInfo, setUserInfo] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [accessToken, setAccessToken] = useState(null); // Store access token

  useEffect(() => {
    async function fetchUserData() {
      if (state?.isAuthenticated) {
        try {
          // 1. Basic user info
          const basicInfo = await getBasicUserInfo();
          setUserInfo(basicInfo);
          console.log("✅ Basic user info:", basicInfo);

          // 2. ID token
          const idToken = await getIDToken();
          console.log("🔑 Raw ID Token:", idToken);

          // 3. Access token
          const fetchedAccessToken = await getAccessToken();
          setAccessToken(fetchedAccessToken);
          console.log("🔐 Access Token:", fetchedAccessToken);

          // 4. Decode access token (safe)
          try {
            const decodedAccessToken = jwtDecode(fetchedAccessToken);
            console.log("📜 Decoded Access Token:", decodedAccessToken);
          } catch (decodeErr) {
            console.error("❌ Failed to decode access token:", decodeErr);
          }

          // 5. Decode ID token to extract roles
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
  }, [state?.isAuthenticated, getBasicUserInfo, getIDToken, getAccessToken]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>LocalLink</h1>

      {!state?.isAuthenticated ? (
        <>
          <p>Welcome! Please login to continue.</p>
          <button onClick={() => signIn()}>Login</button>
        </>
      ) : (
        <>
          <p>Welcome back, {userInfo?.given_name || userInfo?.username || "user"}!</p>
          <p>
            <strong>Email:</strong> {userInfo?.email}
          </p>
          <p>
            <strong>First Name:</strong> {userInfo?.given_name || userInfo?.givenName}
          </p>
          <p>
            <strong>Last Name:</strong> {userInfo?.family_name || userInfo?.familyName}
          </p>
          <p>
            <strong>Roles:</strong>{" "}
            {userRoles.length > 0 ? userRoles.join(", ") : "No roles assigned"}
          </p>
          <p>
            <strong>Access Token:</strong> {accessToken}
          </p>

          {userRoles.includes("service_provider") && (
            <button>Service Provider Dashboard</button>
          )}

          {userRoles.includes("admin") && <button>Admin Dashboard</button>}

          <button onClick={() => signOut()}>Logout</button>
        </>
      )}
    </div>
  );
}

export default App;

