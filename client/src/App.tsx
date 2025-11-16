import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Pinturas from "./pages/Pinturas";
import PinturaDetalle from "./pages/PinturaDetalle";
import Artistas from "./pages/Artistas";
import ArtistaDetalle from "./pages/ArtistaDetalle";
import Museos from "./pages/Museos";
import MuseoDetalle from "./pages/MuseoDetalle";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Pinturas} />
      <Route path="/pintura/:id" component={PinturaDetalle} />
      <Route path="/artistas" component={Artistas} />
      <Route path="/artista/:id" component={ArtistaDetalle} />
      <Route path="/museos" component={Museos} />
      <Route path="/museo/:id" component={MuseoDetalle} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <footer className="bg-card border-t border-border py-8 mt-12">
              <div className="container text-center text-sm text-muted-foreground">
                <p>Catálogo de Pinturas Famosas - Proyecto Académico 2025</p>
              </div>
            </footer>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
