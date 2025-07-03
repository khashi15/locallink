import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import jwtDecode from "jwt-decode";
import axios from "axios";

import Layout from "./components/Layout";
import Spinner from "./components/Spinner";
import Button from "./components/Button";

import Profile from "./pages/Profile.jsx";
import Services from "./pages/Services.jsx";
import MyServices from "./pages/MyServices.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProfileSetup from "./pages/ProfileSetup.jsx";
import AllUsers from "./pages/AllUsers.jsx";

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

  useEffect(() => {
    async function fetchUserData() {
      if (state?.isAuthenticated) {
        setLoading(true);
        try {
          const basicInfo = await getBasicUserInfo();
          console.log("✅ Basic user info:", basicInfo);

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
          const fetchedAccessToken = await getAccessToken();
          console.log("🛠️ Raw Access Token:", fetchedAccessToken);
          setAccessToken(fetchedAccessToken);

          let rolesFromToken = [];
          if (idToken) {
            const decoded = jwtDecode(idToken);
            const rolesClaim = decoded.roles || decoded.role || [];
            if (Array.isArray(rolesClaim)) {
              rolesFromToken = rolesClaim;
            } else if (rolesClaim) {
              rolesFromToken = [rolesClaim];
            }
          }
          console.log("📜 Roles from Token:", rolesFromToken);
          setUserRoles(rolesFromToken);

          const isRoleAssigned = ["admin", "customer", "service_provider"].some((role) =>
            rolesFromToken.includes(role)
          );

          if (!isRoleAssigned) {
            console.warn("⚠️ No valid role assigned, redirecting to profile setup.");
            setProfileComplete(false);
            navigate("/profile-setup");
            return;
          }

          await checkProfile(fetchedAccessToken);

          // After profile check success, mark complete and navigate home
          setProfileComplete(true);
          navigate("/");

        } catch (error) {
          console.error("❌ Error fetching user info or token", error);
          setUserInfo(null);
          setUserRoles([]);
          setAccessToken(null);
          setProfileComplete(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.isAuthenticated]);

  const checkProfile = async (token) => {
    try {
      const res = await axios.get("http://localhost:3001/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Profile found:", res.data);

      setUserInfo((prev) => ({
        ...prev,
        firstName: res.data.firstName || prev.firstName,
        lastName: res.data.lastName || prev.lastName,
        contactNumber: res.data.contactNumber || prev.contactNumber,
        username: res.data.username || prev.username,
        userId: res.data.id || prev.userId,
      }));

      setProfileComplete(true);
    } catch (err) {
      console.warn("⚠️ Profile not found, redirecting to profile setup.", err.response?.data || err.message);
      setProfileComplete(false);
      navigate("/profile-setup");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-950">
        <Spinner />
      </div>
    );
  }

  if (!state?.isAuthenticated) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white px-4">
        <h1 className="text-5xl font-extrabold mb-4 tracking-wide">
          LocalLink
        </h1>
        <p className="mb-6 text-lg text-center">
          Welcome! Please log in to continue.
        </p>
        <Button onClick={() => signIn()} className="w-52 text-lg">
          Login
        </Button>
      </div>
    );
  }

  const isAdmin = userRoles.includes("admin");
  const isServiceProvider = userRoles.includes("service_provider");
  const hasValidRole = ["admin", "customer", "service_provider"].some(role =>
    userRoles.includes(role)
  );

  if (!profileComplete) {
    return (
      <Routes>
        <Route
          path="/profile-setup"
          element={
            hasValidRole ? (
              <Navigate to="/" replace />
            ) : (
              <ProfileSetup
                accessToken={accessToken}
                onComplete={() => {
                  setProfileComplete(true);
                  navigate("/");
                }}
              />
            )
          }
        />
        <Route
          path="*"
          element={
            <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white px-4">
              <p className="text-xl mb-4">
                Please complete your profile to continue.
              </p>
              <Button onClick={() => navigate("/profile-setup")}>
                Complete Profile
              </Button>
            </div>
          }
        />
      </Routes>
    );
  }

  return (
    <Layout userRoles={userRoles} signOut={signOut}>
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
          path="/my-services"
          element={
            isServiceProvider ? (
              <MyServices accessToken={accessToken} />
            ) : (
              <div className="p-6">
                <p className="text-red-600 font-semibold text-lg">
                  Access Denied
                </p>
              </div>
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminDashboard accessToken={accessToken} userRoles={userRoles} />
            ) : (
              <div className="p-6">
                <p className="text-red-600 font-semibold text-lg">
                  Access Denied
                </p>
              </div>
            )
          }
        />
        <Route
          path="/all-users"
          element={
            isAdmin ? (
              <AllUsers accessToken={accessToken} />
            ) : (
              <div className="p-6">
                <p className="text-red-600 font-semibold text-lg">
                  Access Denied
                </p>
              </div>
            )
          }
        />
        <Route
          path="/"
          element={
            <div className="max-w-3xl mx-auto px-6 py-10">
              <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Welcome back, {userInfo?.firstName || userInfo?.username || "User"}!
              </h1>
              <div className="space-y-4 text-lg text-gray-200">
                <p>
                  <strong className="text-white">Email:</strong> {userInfo?.email}
                </p>
                <p>
                  <strong className="text-white">Roles:</strong>{" "}
                  {userRoles.length > 0 ? userRoles.join(", ") : "None"}
                </p>
              </div>
            </div>
          }
        />
        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
