import { Link, useLocation } from "wouter";
import { Palette, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Palette className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Catálogo de Pinturas</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") && location === "/"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Pinturas
            </Link>
            <Link
              href="/artistas"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/artistas")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Artistas
            </Link>
            <Link
              href="/museos"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/museos")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Museos
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="relative snipcart-checkout">
            <ShoppingCart className="w-5 h-5" />
            <span className="snipcart-items-count absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center"></span>
          </Button>
        </div>
      </div>
    </header>
  );
}
