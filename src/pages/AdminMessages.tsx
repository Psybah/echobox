import React, { useEffect } from "react";
import MessageDashboard from "@/components/admin/MessageDashboard";
import PageTransition from "@/components/layout/PageTransition";
import { useAdmin } from "@/hooks/use-admin";
import { useNavigate } from "react-router-dom";

const AdminMessages: React.FC = () => {
  const { isAdmin, checkingStatus } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not admin and finished checking
    if (!isAdmin && !checkingStatus) {
      navigate("/admin-login");
    }
  }, [isAdmin, checkingStatus, navigate]);

  // Show loading or the dashboard based on auth status
  return (
    <PageTransition>
      {
        checkingStatus ? (
          <div className="mt-16 flex justify-center items-center mx-auto px-4 py-12 min-h-[50vh] container">
            <div className="border-4 border-primary border-t-transparent rounded-full w-10 h-10 animate-spin" />
          </div>
        ) : isAdmin ? (
          <MessageDashboard />
        ) : null /* Will redirect, no need to render anything */
      }
    </PageTransition>
  );
};

export default AdminMessages;
