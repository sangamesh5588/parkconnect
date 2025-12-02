import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ParkingSquare, Menu, AlignJustify, Search } from 'lucide-react';
import { useState } from 'react';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { SearchBarCompact } from '@/components/SearchBarCompact';
import { HostAuthModal } from '@/components/auth/HostAuthModal';
import { RenterAuthModal } from '@/components/auth/RenterAuthModal';

interface HeaderProps {
  showSearchBar?: boolean;
}

export function Header({ showSearchBar = false }: HeaderProps) {
  const { isScrolled } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();

  // Determine which auth modal to show based on current page
  const isHostPage = location.pathname.startsWith('/host');
  const isRenterPage = location.pathname.startsWith('/renter');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-250 ease-out ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
          : 'bg-white'
      }`}
      style={{ height: '80px' }}
    >
      <div className="container-mobile h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo - Left - Mobile optimized */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl text-foreground hover:text-primary transition-colors duration-200 min-h-[44px] px-2">
            <ParkingSquare className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            <span className="block">ParkConnect</span>
          </Link>

          {/* Search Bar - Center (only on home page) - Mobile responsive */}
          {showSearchBar && (
            <div className="flex-1 max-w-md mx-2 sm:mx-4 md:mx-8">
              {isScrolled ? (
                <SearchBarCompact />
              ) : (
                <>
                  {/* Desktop Search */}
                  <div className="hidden md:flex items-center justify-center">
                    <Link to="/search" className="block w-full max-w-lg">
                      <div className="bg-white rounded-full border border-gray-200 shadow-sm px-6 py-3 flex items-center gap-4 hover:shadow-md transition-shadow duration-200 cursor-pointer min-h-[44px]">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Search className="h-4 w-4" />
                          <span>Where are you going?</span>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Mobile Search - Simplified pill */}
                  <div className="md:hidden">
                    <Link to="/search" className="block">
                      <div className="bg-white rounded-full border border-gray-200 shadow-sm px-4 py-2.5 flex items-center gap-3 hover:shadow-md transition-shadow duration-200 cursor-pointer min-h-[44px]">
                        <Search className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 truncate">Where to park?</span>
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Right Section - Become Host + User Menu - Mobile optimized */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Become a Host - Desktop only, hidden on mobile for cleaner look */}
            <div className="hidden lg:block">
              <Button
                variant="outline"
                asChild
                className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 font-medium rounded-full px-4 sm:px-5 py-2 min-h-[44px]"
              >
                <Link to="/become-host">Become a Host</Link>
              </Button>
            </div>

            {/* Three-Dot Menu - Desktop Dropdown */}
            <div className="hidden md:block">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-muted/60 transition-colors duration-200 min-h-[44px] min-w-[44px]"
                  >
                    <AlignJustify className="h-5 w-5 text-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 bg-background border-border/50 rounded-xl shadow-lg">
                  <div className="p-4">
                    {/* Context-aware Login/Signup Button */}
                    <Button
                      onClick={() => setIsAuthModalOpen(true)}
                      variant="default"
                      className="w-full py-6 font-medium rounded-lg mb-3"
                    >
                      Login or Signup
                    </Button>

                    {/* Become a Host - Full Width */}
                    <Button
                      variant="outline"
                      asChild
                      className="w-full py-6 font-medium border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg mb-3"
                    >
                      <Link to="/become-host">Become a Host</Link>
                    </Button>

                    {/* Help Center */}
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full py-4 font-medium justify-start rounded-lg"
                    >
                      <Link to="/help">Help Center</Link>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Mobile Menu - Mobile only - Improved touch targets */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full min-h-[44px] min-w-[44px]">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[360px] bg-background border-border/50">
                  <nav className="flex flex-col gap-3 mt-8">
                    {/* Become a Host - Prominent in mobile */}
                    <div className="px-4 py-3">
                      <Button
                        variant="outline"
                        asChild
                        className="w-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground font-medium rounded-full py-6 min-h-[48px]"
                      >
                        <Link to="/become-host" onClick={() => setMobileMenuOpen(false)}>
                          Become a Host
                        </Link>
                      </Button>
                    </div>

                    {/* Auth section - Better mobile spacing */}
                    <div className="border-t border-border/50 pt-6 mt-4 space-y-4 px-4">
                      <Button
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        variant="ghost"
                        className="w-full justify-start text-lg font-medium rounded-full py-6 min-h-[48px]"
                      >
                        Log in
                      </Button>
                      <Button
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        variant="default"
                        className="w-full justify-start text-lg font-medium rounded-full py-6 min-h-[48px]"
                      >
                        Sign up
                      </Button>
                    </div>

                    {/* About - Better spacing */}
                    <div className="border-t border-border/50 pt-6 px-4">
                      <Link
                        to="/about"
                        className="block text-lg font-medium text-foreground hover:text-primary transition-colors duration-200 py-4 min-h-[48px] flex items-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        About
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Context-aware Auth Modals */}
      {isHostPage && (
        <HostAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {isRenterPage && (
        <RenterAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {/* Default to Host modal for other pages */}
      {!isHostPage && !isRenterPage && (
        <HostAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </header>
  );
}
