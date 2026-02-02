import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrientationPrompt from "./components/ui/OrientationPrompt";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import FreePlay from "./pages/FreePlay";
import Learn from "./pages/Learn";
import Games from "./pages/Games";
import Songs from "./pages/Songs";
import Parent from "./pages/Parent";
import NoteCatcher from "./pages/games/NoteCatcher";
import MelodyCopy from "./pages/games/MelodyCopy";
import RhythmTap from "./pages/games/RhythmTap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <OrientationPrompt />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/free-play" element={<FreePlay />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/note-catcher" element={<NoteCatcher />} />
          <Route path="/games/melody-copy" element={<MelodyCopy />} />
          <Route path="/games/rhythm-tap" element={<RhythmTap />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/parent" element={<Parent />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
