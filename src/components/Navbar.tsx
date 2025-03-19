
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDocumentStore } from '@/store/documentStore';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const resetStore = useDocumentStore((state) => state.resetStore);

  const handleNewDocument = () => {
    resetStore();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/70 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-medium text-xl">DocuGenius</span>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" onClick={handleNewDocument}>
            New Document
          </Button>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost">GitHub</Button>
          </a>
        </nav>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-background/95 backdrop-blur-sm md:hidden transform transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-8">
          <Button variant="ghost" size="lg" onClick={handleNewDocument}>
            New Document
          </Button>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="lg">GitHub</Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
