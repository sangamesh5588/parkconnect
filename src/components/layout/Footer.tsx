import { Link } from "react-router-dom";
import { ParkingSquare } from "lucide-react";

const Footer = () => {
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
              <li><Link to="/renter" className="hover:text-primary transition-colors">Find Parking</Link></li>
              <li><Link to="/coming-soon" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link to="/coming-soon" className="hover:text-primary transition-colors">Download App</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-responsive-base">For Hosts</h3>
            <ul className="space-y-2 text-responsive-sm text-muted-foreground">
              <li><Link to="/host" className="hover:text-primary transition-colors">Become a Host</Link></li>
              <li><Link to="/coming-soon" className="hover:text-primary transition-colors">Host Resources</Link></li>
              <li><Link to="/coming-soon" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-responsive-base">Company</h3>
            <ul className="space-y-2 text-responsive-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/coming-soon" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/coming-soon" className="hover:text-primary transition-colors">Careers</Link></li>
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

export default Footer;
