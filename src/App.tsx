import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AdminProvider } from "@/hooks/use-admin";
import { AnimatePresence } from "framer-motion";

import Header from "@/components/layout/Header";
import Index from "@/pages/Index";
import SubmitPage from "@/pages/SubmitPage";
import AdminLogin from "@/pages/AdminLogin";
import AdminMessages from "@/pages/AdminMessages";
import NotFound from "@/pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AdminProvider>
        <TooltipProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/submit" element={<SubmitPage />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin-messages" element={<AdminMessages />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
              </main>
            </div>
            <Toaster />
            <Sonner />
          </Router>
        </TooltipProvider>
      </AdminProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
