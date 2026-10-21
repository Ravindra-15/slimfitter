import { useEffect, useState } from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";

import { hasActiveProgramSubscription } from "../../utils/subscriptionCheck";
import { PROGRAM_ID } from "../../utils/programConfig";
const ProtectedProgramRoute = ({ children }) => {
  // 🔒 this app only serves its OWN program (e.g. no YogaT20 videos inside Diabmukt)
  const { id } = useParams();
  const location = useLocation();

  // ============================================
  // 🔄 STATE
  // ============================================
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  // ============================================
  // 🔐 TOKEN CHECK
  // ============================================
  const customerToken =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const doctorToken =
    localStorage.getItem("doctorToken") ||
    sessionStorage.getItem("doctorToken");

  const isAuthenticated = customerToken || doctorToken;

  // ============================================
  // 🚀 VERIFY SUBSCRIPTION
  // ============================================
  useEffect(() => {
    const verifySubscription = async () => {
      try {
        // 🚫 Not logged in
        if (!isAuthenticated) {
          setHasAccess(false);
          return;
        }

        // ✅ Active, unexpired subscription to THIS program only
        setHasAccess(await hasActiveProgramSubscription());
      } catch (err) {
        console.error(
          "ProtectedProgramRoute error:",
          err
        );

        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifySubscription();
  }, [isAuthenticated]);
  // 🔀 Another program's URL opened in this app → same page for this app's program
  if (id && id !== PROGRAM_ID) {
    return (
      <Navigate
        to={location.pathname.replace(`/programs/${id}`, `/programs/${PROGRAM_ID}`) + location.search}
        replace
      />
    );
  }


  // ============================================
  // ⏳ LOADER
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4E4391] border-t-transparent rounded-full animate-spin" />

          <p className="text-sm text-[#6B7280] font-medium">
            Verifying your subscription...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // 🚫 ACCESS DENIED
  // ============================================
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  // ============================================
  // ✅ ACCESS GRANTED
  // ============================================
  return children;
};

export default ProtectedProgramRoute;