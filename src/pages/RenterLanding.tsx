import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { RenterAuthModal } from "@/components/auth/RenterAuthModal";
import { MapPin, Clock, CreditCard, CheckCircle } from "lucide-react";
import renterHero from "@/assets/renter-hero.jpg";
import { useState } from "react";

const RenterLanding = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Book Parking Instantly
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground">
                Find available parking spots near your destination. Book in seconds, park with confidence.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Real-Time Availability</h3>
                    <p className="text-muted-foreground">See exactly which spaces are available right now</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Instant Booking</h3>
                    <p className="text-muted-foreground">Reserve your spot in just a few taps</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Flexible Times</h3>
                    <p className="text-muted-foreground">Book by the hour, day, or month</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-strong"
              >
                Start Booking
              </Button>
            </div>

            <div className="relative">
              <img 
                src={renterHero} 
                alt="Happy person booking parking" 
                className="rounded-2xl shadow-strong w-full h-[400px] sm:h-[600px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-muted-foreground">Four simple steps to hassle-free parking</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center border-border hover:shadow-soft transition-shadow">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">1. Search</h3>
              <p className="text-muted-foreground">Enter your destination and find nearby parking spots</p>
            </Card>

            <Card className="p-6 text-center border-border hover:shadow-soft transition-shadow">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">2. Select Time</h3>
              <p className="text-muted-foreground">Choose your parking duration and see instant pricing</p>
            </Card>

            <Card className="p-6 text-center border-border hover:shadow-soft transition-shadow">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">3. Pay Securely</h3>
              <p className="text-muted-foreground">Complete your booking with secure payment options</p>
            </Card>

            <Card className="p-6 text-center border-border hover:shadow-soft transition-shadow">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">4. Park & Go</h3>
              <p className="text-muted-foreground">Navigate to your spot and park with peace of mind</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Card className="bg-gradient-primary p-8 sm:p-12 text-center border-0 shadow-strong">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Never Circle for Parking Again
            </h2>
            <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of drivers who have saved time and reduced stress with ParkEase.
            </p>
            <Button size="lg" variant="secondary" asChild className="bg-background text-foreground hover:bg-background/90 shadow-soft">
              <Link to="/coming-soon">Download the App</Link>
            </Button>
          </Card>
        </div>
      </section>

      <Footer />

      <RenterAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default RenterLanding;
