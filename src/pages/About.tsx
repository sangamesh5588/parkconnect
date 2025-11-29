import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Target, Users, Lightbulb, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            About ParkEase
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            We're on a mission to make parking simple, accessible, and profitable for everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4">
                ParkEase was founded on a simple idea: parking shouldn't be a hassle. Whether you're looking for a spot or have one to share, we believe the process should be seamless, secure, and mutually beneficial.
              </p>
              <p className="text-lg text-muted-foreground">
                We're building a community-driven marketplace that connects drivers with parking space owners, creating value for both sides while reducing urban congestion and making cities more livable.
              </p>
            </div>
            <Card className="p-8 bg-primary/5 border-primary/20">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Our Vision</h3>
                    <p className="text-muted-foreground">To become the most trusted parking marketplace, making every parking space accessible and every search successful.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Innovation</h3>
                    <p className="text-muted-foreground">Leveraging technology to solve real-world problems and create smarter parking solutions.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-lg sm:text-xl text-muted-foreground">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-border hover:shadow-soft transition-shadow">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Community First</h3>
              <p className="text-muted-foreground">We build for our users, listening to their needs and continuously improving based on their feedback.</p>
            </Card>

            <Card className="p-8 text-center border-border hover:shadow-soft transition-shadow">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Trust & Safety</h3>
              <p className="text-muted-foreground">Security and transparency are paramount. We verify users and ensure secure transactions every time.</p>
            </Card>

            <Card className="p-8 text-center border-border hover:shadow-soft transition-shadow">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Simplicity</h3>
              <p className="text-muted-foreground">We make complex transactions simple, removing friction from every step of the parking experience.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">50K+</p>
              <p className="text-sm sm:text-base text-muted-foreground">Active Users</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">10K+</p>
              <p className="text-sm sm:text-base text-muted-foreground">Listed Spaces</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">100K+</p>
              <p className="text-sm sm:text-base text-muted-foreground">Successful Bookings</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">25+</p>
              <p className="text-sm sm:text-base text-muted-foreground">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
