import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Rocket, ArrowLeft } from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl text-center">
          <Card className="p-12 border-border shadow-strong">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
              <Rocket className="h-12 w-12 text-primary" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Coming Soon
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              We're working hard to bring you this feature. Our mobile apps and full booking system will be available soon!
            </p>

            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                In the meantime, explore our platform and learn how ParkEase can help you find parking or earn money from your space.
              </p>

              <div className="pt-8">
                <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90 transition-opacity">
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">What's Coming</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <p className="text-muted-foreground">iOS & Android Apps</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <p className="text-muted-foreground">Real-time Booking System</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <p className="text-muted-foreground">Payment Integration</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  <p className="text-muted-foreground">User Dashboard</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ComingSoon;
