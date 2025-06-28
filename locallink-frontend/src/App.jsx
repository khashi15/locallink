import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import jwtDecode from "jwt-decode";
import axios from "axios";

import Layout from "./components/Layout";
import NavBar from "./components/NavBar";
import Spinner from "./components/Spinner";

import Profile from "./pages/Profile.jsx";
import Services from "./pages/Services.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProfileSetup from "./pages/ProfileSetup.jsx";

function App() {
  const {
    state,
    signIn,
    signOut,
    getBasicUserInfo,
    getIDToken,
    getAccessToken,
  } = useAuthContext();

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  // 🔍 Log raw Asgardeo user object
  useEffect(() => {
    console.log("🔍 User info from state.user:", state?.user);
  }, [state?.user]);

  useEffect(() => {
    async function fetchUserData() {
      if (state?.isAuthenticated) {
        setLoading(true);
        try {
          const basicInfo = await getBasicUserInfo();
          console.log("✅ Basic user info:", basicInfo);

          // ✅ Map keys properly
          const mappedUserInfo = {
            userId: basicInfo.sub || "",
            username: basicInfo.email || "",
            firstName: basicInfo.given_name || basicInfo.givenName || "",
            lastName: basicInfo.family_name || basicInfo.familyName || "",
            role: basicInfo.role || "",
            country: basicInfo.country || "",
            email: basicInfo.email || "",
            mobile: basicInfo.mobile || basicInfo.mobile_number || "",
            birthDate: basicInfo.birthdate || "",
          };
          setUserInfo(mappedUserInfo);

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

          await checkProfile(fetchedAccessToken);
        } catch (error) {
          console.error("❌ Error fetching user info or token", error);
          setUserInfo(null);
          setUserRoles([]);
          setAccessToken(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUserInfo(null);
        setUserRoles([]);
        setAccessToken(null);
        setProfileComplete(false);
      }
    }

    fetchUserData();
  }, [state?.isAuthenticated]);

  const checkProfile = async (token) => {
    const isAdmin = userRoles.includes("admin");

    if (isAdmin) {
      console.log("👑 Admin detected - skipping profile check");
      setProfileComplete(true);
      return;
    }

    try {
      const res = await axios.get("http://localhost:3001/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("👤 Profile exists:", res.data);
      setProfileComplete(true);
    } catch (err) {
      console.warn("⚠️ Profile not found, redirecting to setup");
      setProfileComplete(false);
      navigate("/profile-setup");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-900">
        <Spinner />
      </div>
    );
  }

  if (!state?.isAuthenticated) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
        <h1 className="text-5xl font-extrabold mb-4">LocalLink</h1>
        <p className="mb-6 text-lg">Welcome! Please login to continue.</p>
        <button
          onClick={() => signIn()}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    );
  }

  const isAdmin = userRoles.includes("admin");

  if (!profileComplete && !isAdmin) {
    return (
      <Routes>
        <Route
          path="/profile-setup"
          element={
            <ProfileSetup
              accessToken={accessToken}
              onComplete={() => {
                setProfileComplete(true);
                navigate("/");
              }}
            />
          }
        />
        <Route
          path="*"
          element={
            <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
              <p className="text-xl mb-4">Please complete your profile first.</p>
              <button
                onClick={() => navigate("/profile-setup")}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
                Complete Profile
              </button>
            </div>
          }
        />
      </Routes>
    );
  }

  return (
    <Layout>
      <NavBar userRoles={userRoles} signOut={signOut} />

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
              <Dashboard accessToken={accessToken} userId={userInfo?.userId} />
            ) : (
              <p className="text-red-600 font-semibold p-6">Access Denied</p>
            )
          }
        />
        <Route
          path="/admin"
          element={
            userRoles.includes("admin") ? (
              <AdminDashboard
                accessToken={accessToken}
                userRoles={userRoles}
              />
            ) : (
              <p className="text-red-600 font-semibold p-6">Access Denied</p>
            )
          }
        />
        <Route
          path="/"
          element={
            <div className="p-6">
              <p className="mb-2 text-lg">
                Welcome back,{" "}
                <span className="font-semibold">
                  {userInfo?.firstName ||
                    userInfo?.username ||
                    "user"}
                </span>
                !
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {userInfo?.email}
              </p>
              <p>
                <strong>Roles:</strong>{" "}
                <span className="italic">
                  {userRoles.length > 0 ? userRoles.join(", ") : "None"}
                </span>
              </p>
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
