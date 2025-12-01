import { Link } from "react-router-dom";
import { ParkingSquare } from "lucide-react";

const FooterRenter = () => {
  const handleLinkClick = () => {
    // Ensure scroll to top when footer links are clicked
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 100);
  };

  return (
    <footer className="bg-muted border-t border-border mt-20">
      <div className="container-mobile py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-responsive-lg text-foreground mb-4">
              <ParkingSquare className="h-8 w-8 text-primary" />
              <span>ParkConnect</span>
            </Link>
            <p className="text-muted-foreground text-responsive-sm">
              Making parking simple, accessible, and profitable for everyone.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-responsive-base">For Renters</h3>
            <ul className="space-y-2 text-responsive-sm text-muted-foreground">
              <li><Link to="/search" className="hover:text-primary transition-colors">Find Parking</Link></li>
              <li><Link to="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link to="/coming-soon" className="hover:text-primary transition-colors">Download App</Link></li>
              <li><Link to="/coming-soon" className="hover:text-primary transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-responsive-base">For Hosts</h3>
            <ul className="space-y-2 text-responsive-sm text-muted-foreground">
              <li><Link to="/host" className="hover:text-primary transition-colors">Become a Host</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-responsive-base">Support & Legal</h3>
            <ul className="space-y-2 text-responsive-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-responsive-sm text-muted-foreground">
          <p>&copy; 2025 ParkConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterRenter;
