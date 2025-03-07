
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AdminProvider } from "@/hooks/use-admin";
import { AnimatePresence } from "framer-motion";

import Header from "@/components/layout/Header";
import Index from "@/pages/Index";
import SubmitPage from "@/pages/SubmitPage";
import AdminLogin from "@/pages/AdminLogin";
import AdminMessages from "@/pages/AdminMessages";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <AdminProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/submit" element={<SubmitPage />} />
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/messages" element={<AdminMessages />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AdminProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
