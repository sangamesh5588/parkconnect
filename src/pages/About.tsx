import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import Footer from "@/components/layout/Footer";
import FooterRenter from "@/components/layout/FooterRenter";
import { useLocation } from "react-router-dom";
import { ParkingSquare, Users, MapPin, Award, Heart, Target, Zap, Globe } from "lucide-react";

const About = () => {
  const location = useLocation();
  const isHostPage = location.pathname.includes('/host');

  return (
    <div className="min-h-screen bg-background">
      <Header showSearchBar={false} />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                About ParkConnect
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Revolutionizing Urban
                <span className="block text-primary">Parking</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                We're on a mission to solve one of the biggest frustrations of modern life:
                finding parking. Our platform connects people who need parking with those who have extra space.
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">15K+</div>
                <div className="text-sm text-gray-600">Active Hosts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-gray-600">Parking Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">25+</div>
                <div className="text-sm text-gray-600">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">4.9★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  ParkConnect was born from a simple frustration: why is parking always such a headache?
                  Our founders, experienced in urban planning and technology, saw an opportunity to create
                  a platform that could efficiently match parking supply with demand.
                </p>
                <p>
                  What started as an idea during late-night conversations has grown into a comprehensive
                  platform that serves thousands of users across major Indian cities. We believe that
                  technology should make life easier, not more complicated.
                </p>
                <p>
                  Today, ParkConnect is more than just an app—it's a community of hosts and renters
                  working together to solve one of urban life's biggest challenges.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 lg:p-12">
                <div className="text-center space-y-4">
                  <ParkingSquare className="w-16 h-16 text-primary mx-auto" />
                  <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
                  <p className="text-gray-600">
                    To make parking effortless and accessible for everyone, everywhere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust</h3>
              <p className="text-sm text-gray-600">
                Building trust through transparency, security, and reliability in every interaction.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-sm text-gray-600">
                Constantly improving our technology to provide the best user experience possible.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-sm text-gray-600">
                Fostering a supportive community of hosts and renters who help each other.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-sm text-gray-600">
                Reducing traffic congestion and emissions through efficient parking utilization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connecting parking supply with demand through technology
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* For Renters */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">For Renters</h3>
              <p className="text-gray-600 mb-6">
                Find available parking spots in real-time, book instantly, and pay securely.
                Never waste time searching for parking again.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/search">Find Parking</Link>
              </Button>
            </div>

            {/* For Hosts */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ParkingSquare className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">For Hosts</h3>
              <p className="text-gray-600 mb-6">
                Turn your unused parking space into a steady income stream.
                Set your own prices and availability.
              </p>
              <Button asChild className="w-full">
                <Link to="/host">Become a Host</Link>
              </Button>
            </div>

            {/* Technology */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Technology</h3>
              <p className="text-gray-600 mb-6">
                AI-powered matching, real-time availability, and secure transactions
                make parking effortless for everyone.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Team/Leadership (Optional - can be expanded later) */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the people driving ParkConnect's vision forward
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">RK</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Rahul Kumar</h3>
              <p className="text-sm text-primary mb-2">CEO & Co-Founder</p>
              <p className="text-sm text-gray-600">
                Former urban planner with 10+ years in smart city initiatives.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">PS</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Priya Sharma</h3>
              <p className="text-sm text-primary mb-2">CTO & Co-Founder</p>
              <p className="text-sm text-gray-600">
                Tech veteran with expertise in location-based services and mobile apps.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">AJ</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Arjun Jain</h3>
              <p className="text-sm text-primary mb-2">Head of Operations</p>
              <p className="text-sm text-gray-600">
                Logistics expert ensuring smooth operations across all cities.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      {isHostPage ? <Footer /> : <FooterRenter />}
    </div>
  );
};

export default About;
