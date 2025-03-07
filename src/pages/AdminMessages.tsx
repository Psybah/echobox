
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmin } from '@/hooks/use-admin';
import PageTransition from '@/components/layout/PageTransition';
import MessageDashboard from '@/components/admin/MessageDashboard';

const AdminMessages: React.FC = () => {
  const { isLoggedIn } = useAdmin();

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-6">
        <MessageDashboard />
      </div>
    </PageTransition>
  );
};

export default AdminMessages;
