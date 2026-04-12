import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link } from "react-router-dom"; // ← Agregar imports
import neoledLogo from '@/assets/images/84af3e7f-9171-4c73-900f-9499a96732341.png';

interface HeaderProps {
  cartItemsCount: number;
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
}

export function Header({ cartItemsCount, onSearchChange, onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // ← Hook para navegación

  useEffect(() => {
    onSearchChange(searchQuery);
  }, [searchQuery, onSearchChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleLoginClick = () => {
    navigate('/login'); // ← Usar navigate en lugar de window.location
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur-sm border-b border-primary/20 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Link a inicio */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={neoledLogo} 
              alt="NEOLED Logo" 
              className="w-65 h-auto mx-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/#inicio" 
              className="text-primary-foreground hover:text-secondary transition-colors duration-300 font-bold"
            >
              Inicio
            </Link>
            <Link 
              to="/#contacto" 
              className="text-primary-foreground hover:text-secondary transition-colors duration-300 font-bold"
            >
              Contacto
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar productos LED..."
                className="pl-10 bg-white/90 border-secondary/30 focus:border-secondary focus:ring-secondary/50"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-primary-foreground hover:text-secondary hover:bg-primary-foreground/10"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Login Button */}
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex bg-secondary text-primary hover:bg-secondary/90 hover:text-primary"
              onClick={handleLoginClick} // ← Usar la función corregida
            >
              Iniciar Sesión
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-primary-foreground hover:text-secondary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar productos LED..."
              className="pl-10 bg-white/90 border-secondary/30 focus:border-secondary focus:ring-secondary/50"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-primary-foreground/20 pt-4 animate-fade-in-up">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/#inicio" 
                className="text-primary-foreground hover:text-secondary transition-colors duration-300 font-bold py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/#contacto" 
                className="text-primary-foreground hover:text-secondary transition-colors duration-300 font-bold py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="bg-secondary text-primary hover:bg-secondary/90 hover:text-primary mx-2 mt-3"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/login'); // ← Usar navigate
                }}
              >
                Iniciar Sesión
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}