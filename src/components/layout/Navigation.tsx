import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ParkingSquare, Menu, User } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50">
      <div className="container-mobile">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Clean and minimal */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-primary transition-colors duration-200">
            <ParkingSquare className="h-7 w-7 text-primary" />
            <span className="hidden sm:block">ParkConnect</span>
          </Link>

          {/* Desktop Navigation - Clean Airbnb style */}
          <div className="hidden md:flex items-center gap-3">
            {/* Become a Host - Clean outline button */}
            <Button
              variant="outline"
              asChild
              className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 font-medium rounded-full px-5 py-2"
            >
              <Link to="/coming-soon">Become a Host</Link>
            </Button>

            {/* User Menu Icon - Clean profile icon */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-muted/60 transition-colors duration-200"
                >
                  <User className="h-5 w-5 text-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background border-border/50">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="text-center pb-4 border-b border-border/50">
                    <h3 className="font-semibold text-lg">Welcome to ParkConnect</h3>
                    <p className="text-muted-foreground text-sm">Sign in to access your account</p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      asChild
                      className="w-full rounded-full py-6 font-medium"
                    >
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full rounded-full py-6 font-medium border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Link to="/login">Sign up</Link>
                    </Button>
                  </div>

                  <div className="border-t border-border/50 pt-4">
                    <Link
                      to="/about"
                      className="block text-foreground hover:text-primary transition-colors duration-200 text-sm font-medium py-2"
                    >
                      About
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="touch-target">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background border-border/50">
              <nav className="flex flex-col gap-2 mt-8">
                {/* Clean mobile menu items */}
                <Link
                  to="/about"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors duration-200 px-4 py-3 rounded-lg hover:bg-muted/60"
                  onClick={() => setOpen(false)}
                >
                  About
                </Link>

                {/* Become a Host - Prominent in mobile too */}
                <div className="px-4 py-2">
                  <Button
                    variant="outline"
                    asChild
                    className="w-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground font-medium rounded-full"
                  >
                    <Link to="/coming-soon" onClick={() => setOpen(false)}>Become a Host</Link>
                  </Button>
                </div>

                {/* Auth section */}
                <div className="border-t border-border/50 pt-6 mt-4 space-y-3 px-4">
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start text-lg font-medium rounded-full py-6"
                  >
                    <Link to="/coming-soon" onClick={() => setOpen(false)}>Log in</Link>
                  </Button>
                  <Button
                    variant="default"
                    asChild
                    className="w-full justify-start text-lg font-medium rounded-full py-6"
                  >
                    <Link to="/coming-soon" onClick={() => setOpen(false)}>Sign up</Link>
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
