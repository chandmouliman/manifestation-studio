import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="max-w-md mx-auto relative min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/affirmations" element={<AffirmationsPage />} />
              <Route path="/vision-board" element={<VisionBoardPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/night-mode" element={<NightModePage />} />
              <Route path="/timer" element={<TimerPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
