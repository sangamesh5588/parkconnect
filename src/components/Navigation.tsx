import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ParkingSquare, Menu } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-primary transition-colors">
            <ParkingSquare className="h-8 w-8 text-primary" />
            <span>ParkEase</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/renter" className="text-foreground hover:text-primary transition-colors">
              Find Parking
            </Link>
            <Link to="/host" className="text-foreground hover:text-primary transition-colors">
              Become a Host
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/coming-soon">Login</Link>
            </Button>
            <Button variant="default" asChild>
              <Link to="/coming-soon">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 mt-8">
                <Link 
                  to="/renter" 
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Find Parking
                </Link>
                <Link 
                  to="/host" 
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Become a Host
                </Link>
                <Link 
                  to="/about" 
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  About
                </Link>
                <div className="border-t border-border pt-6 mt-2 space-y-3">
                  <Button variant="ghost" asChild className="w-full justify-start text-lg">
                    <Link to="/coming-soon" onClick={() => setOpen(false)}>Login</Link>
                  </Button>
                  <Button variant="default" asChild className="w-full justify-start text-lg">
                    <Link to="/coming-soon" onClick={() => setOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
