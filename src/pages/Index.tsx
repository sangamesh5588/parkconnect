import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Search, DollarSign, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/hero-parking.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Find Parking or Earn Money From Your Space
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground">
                The easiest way to book parking or turn your empty space into a source of income.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-strong">
                  <Link to="/renter">
                    <Search className="mr-2 h-5 w-5" />
                    Find Parking
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground shadow-soft">
                  <Link to="/host">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Become a Host
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <img 
                src={heroImage} 
                alt="Modern parking spaces" 
                className="rounded-2xl shadow-strong w-full h-[400px] sm:h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why Choose ParkEase?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground">Simple, secure, and seamless parking solutions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 hover:shadow-soft transition-shadow border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Easy Search</h3>
              <p className="text-muted-foreground">Find parking spots near you in seconds with our smart search.</p>
            </Card>

            <Card className="p-6 hover:shadow-soft transition-shadow border-border">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Earn Extra Income</h3>
              <p className="text-muted-foreground">List your parking space and start earning money immediately.</p>
            </Card>

            <Card className="p-6 hover:shadow-soft transition-shadow border-border">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Secure & Safe</h3>
              <p className="text-muted-foreground">Verified users and secure payments for peace of mind.</p>
            </Card>

            <Card className="p-6 hover:shadow-soft transition-shadow border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">24/7 Availability</h3>
              <p className="text-muted-foreground">Book or manage your listings anytime, anywhere.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Sophisticated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600"></div>

        {/* Elegant pattern overlay */}
        <div className="absolute inset-0 opacity-8" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        {/* Floating decorative elements */}
        <div className="absolute top-12 left-12 w-20 h-20 bg-white/8 rounded-full blur-lg animate-pulse"></div>
        <div className="absolute bottom-12 right-12 w-28 h-28 bg-cyan-200/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-violet-200/10 rounded-full blur-md animate-pulse delay-1000"></div>

        <div className="relative container mx-auto z-10">
          <Card className="bg-white/95 backdrop-blur-sm p-8 sm:p-12 text-center border-0 shadow-2xl max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who have already discovered the easiest way to park or earn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="default" asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8">
                <Link to="/renter">Find Parking Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8">
                <Link to="/host">Start Hosting</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
