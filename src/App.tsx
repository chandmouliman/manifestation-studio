import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import HomePage from "./pages/HomePage";
import AffirmationsPage from "./pages/AffirmationsPage";
import VisionBoardPage from "./pages/VisionBoardPage";
import JournalPage from "./pages/JournalPage";
import MenuPage from "./pages/MenuPage";
import NightModePage from "./pages/NightModePage";
import TimerPage from "./pages/TimerPage";
import ToolsPage from "./pages/ToolsPage";
import NotFound from "./pages/NotFound";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const queryClient = new QueryClient();

const AppLoading = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-display text-muted-foreground animate-pulse">Initializing Reality...</p>
    </div>
  </div>
);

const AppContent = () => {
  const { isLoading } = useAuth();
  
  if (isLoading) return <AppLoading />;

  return (
    <div className="max-w-md mx-auto relative min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/affirmations" element={<RouteGuard component={<AffirmationsPage />} />} />
        <Route path="/vision-board" element={<RouteGuard component={<VisionBoardPage />} />} />
        <Route path="/journal" element={<RouteGuard component={<JournalPage />} />} />
        <Route path="/menu" element={<RouteGuard component={<MenuPage />} />} />
        <Route path="/night-mode" element={<RouteGuard component={<NightModePage />} />} />
        <Route path="/timer" element={<RouteGuard component={<TimerPage />} />} />
        <Route path="/tools" element={<RouteGuard component={<ToolsPage />} />} />
        <Route path="*" element={<RouteGuard component={<NotFound />} />} />
      </Routes>
      <BottomNav />
    </div>
  );
};

const RouteGuard = ({ component }: { component: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  }, [user, navigate]);

  return <>{component}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
