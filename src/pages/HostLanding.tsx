import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import Footer from "@/components/layout/Footer";
import { HostAuthModal } from "@/components/auth/HostAuthModal";
import { DollarSign, Shield, Clock, Users, Star, CheckCircle, TrendingUp, MapPin, CreditCard } from "lucide-react";
import { useState } from "react";

const HostLanding = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header showSearchBar={false} />

      {/* Hero Section - Mobile-First Responsive */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8 sm:space-y-12">
            {/* Headline - Mobile Optimized */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight px-2">
                Hey, that empty parking spot
                <span className="block text-primary">in your driveway?</span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-2">
                Yeah, we know it's just sitting there. What if we told you it could pay your electricity bill?
                Or fund your next vacation? That's what we're here for.
              </p>
            </div>

            {/* Host Benefit Cards - Mobile Stacked */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-2">
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🏠</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Homes</h3>
                <p className="text-sm sm:text-base text-gray-600">Unlock extra monthly income from unused spaces</p>
              </div>

              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🏢</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Businesses</h3>
                <p className="text-sm sm:text-base text-gray-600">Monetize your underused parking effortlessly</p>
              </div>

              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🛍️</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Malls</h3>
                <p className="text-sm sm:text-base text-gray-600">Earn more from existing parking infrastructure</p>
              </div>
            </div>

            {/* Trust Indicators - Mobile Stacked */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto px-2">
              <div className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm w-full sm:w-auto">
                <span className="text-yellow-500">⭐</span>
                <span className="text-xs sm:text-sm font-medium text-gray-700">Trusted by thousands of hosts</span>
              </div>

              <div className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm w-full sm:w-auto">
                <span className="text-blue-600">💼</span>
                <span className="text-xs sm:text-sm font-medium text-gray-700">Proven platform with high demand</span>
              </div>

              <div className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm w-full sm:w-auto">
                <span className="text-green-600">🔒</span>
                <span className="text-xs sm:text-sm font-medium text-gray-700">Safe, secure & fully managed</span>
              </div>

              <div className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm w-full sm:w-auto">
                <span className="text-purple-600">⏱️</span>
                <span className="text-xs sm:text-sm font-medium text-gray-700">Fast onboarding — get listed in minutes</span>
              </div>
            </div>

            {/* CTA Buttons - Mobile Touch-Friendly */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center items-center pt-6 sm:pt-8 px-4">
              <Button
                size="lg"
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg w-full sm:w-auto min-h-[48px]"
              >
                Become a Host
              </Button>

              <Button size="lg" variant="outline" asChild className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto min-h-[48px]">
                <Link to="#how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>

            {/* Small Benefits - Mobile Optimized */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-600 pt-4 px-2">
              <span>Free to join</span>
              <span className="hidden sm:inline">•</span>
              <span>No setup fees</span>
              <span className="hidden sm:inline">•</span>
              <span>Weekly payouts</span>
              <span className="hidden sm:inline">•</span>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Host With Us - Mobile-First Responsive */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              Why Join Our Community?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              We're not just another app. We're a community of hosts who've discovered that their parking spaces
              can actually pay for their lifestyle. Here's what makes it real for you.
            </p>
          </div>

          {/* Mobile: Single column, Tablet: 2 columns, Desktop: 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {/* Scale & Earnings */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20">
              <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 sm:h-7 lg:h-8 w-6 sm:w-7 lg:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Scale From 1 to 100+ Spots</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Start with your driveway. Scale to commercial lots. Our platform grows with your parking inventory and maximizes every opportunity.
              </p>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-primary">Revenue potential: ₹500 - ₹75,000/month</div>
            </div>

            {/* Security & Trust */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
              <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-6 sm:h-7 lg:h-8 w-6 sm:w-7 lg:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Bank-Level Security</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Every booking is protected by enterprise-grade security. Verified drivers, insured transactions, and 24/7 fraud prevention.
              </p>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-green-600">Your peace of mind guaranteed</div>
            </div>

            {/* Automation & Ease */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Clock className="h-6 sm:h-7 lg:h-8 w-6 sm:w-7 lg:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Set It & Forget It</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Automated booking confirmations, instant payments, and smart pricing. Focus on your business while we handle the operations.
              </p>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-blue-600">Zero daily management required</div>
            </div>

            {/* Payments */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
              <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <CreditCard className="h-6 sm:h-7 lg:h-8 w-6 sm:w-7 lg:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Lightning-Fast Payouts</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Get paid instantly after each booking. UPI, bank transfer, or digital wallet - choose your preferred payment method.
              </p>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-purple-600">Money in your account within hours</div>
            </div>

            {/* Community & Trust */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200">
              <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-6 sm:h-7 lg:h-8 w-6 sm:w-7 lg:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Trusted by Industry Leaders</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                From local homeowners to Fortune 500 companies. 15,000+ hosts, 4.9★ rating, and growing every day.
              </p>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-orange-600">Join the success stories</div>
            </div>

            {/* Intelligence */}
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-teal-200">
              <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="h-6 sm:h-7 lg:h-8 w-6 sm:w-7 lg:w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Smart Revenue Optimization</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                AI analyzes demand patterns and competition to suggest optimal pricing. Maximize earnings with data-driven insights.
              </p>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-teal-600">Earn 30% more with smart pricing</div>
            </div>
          </div>

          {/* Bottom CTA - Mobile Optimized */}
          <div className="text-center mt-12 sm:mt-16 lg:mt-16 px-4">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-primary/20">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to Transform Your Parking Into Profit?</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
                Join thousands of successful hosts who are already earning passive income from their parking spaces.
              </p>
              <Button
                size="lg"
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg"
              >
                Start Earning Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Mobile-First Responsive */}
      <section className="py-16 sm:py-20 lg:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 px-2">
              Get Started in 4 Simple Steps
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-2">
              From signup to your first booking in under 10 minutes
            </p>
          </div>

          {/* Mobile: Single column with horizontal cards, Tablet/Desktop: 2x2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex sm:flex-col items-center sm:text-center bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center mb-0 sm:mb-4 mr-4 sm:mr-0 flex-shrink-0 shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">1</span>
              </div>
              <div className="flex-1 sm:flex-initial">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Sign Up</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Create your host account with phone verification
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:text-center bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center mb-0 sm:mb-4 mr-4 sm:mr-0 flex-shrink-0 shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">2</span>
              </div>
              <div className="flex-1 sm:flex-initial">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Complete Profile</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Add personal details, address, and payment info
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:text-center bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center mb-0 sm:mb-4 mr-4 sm:mr-0 flex-shrink-0 shadow-lg">
                <span className="text-white font-bold text-lg sm:text-xl">3</span>
              </div>
              <div className="flex-1 sm:flex-initial">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Verify Identity</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Quick KYC verification to ensure safety
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:text-center bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-500 flex items-center justify-center mb-0 sm:mb-4 mr-4 sm:mr-0 flex-shrink-0 shadow-lg">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="flex-1 sm:flex-initial">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Start Earning</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  List your space and start receiving bookings
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety - Enhanced */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Your Safety is Our Priority
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every aspect of ParkConnect is designed with your security and peace of mind in mind
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Comprehensive Safety Features */}
            <div className="space-y-8">
              <div className="grid gap-6">
                {/* Verified Users */}
                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Users Only</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Every renter undergoes comprehensive background verification, including ID checks,
                        driving records, and criminal background screening before they can book.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secure Payments */}
                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-green-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Bank-Level Payment Security</h3>
                      <p className="text-gray-600 leading-relaxed">
                        PCI DSS compliant payment processing with end-to-end encryption.
                        Funds are held securely until parking is successfully completed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 24/7 Support */}
                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Expert Support</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Round-the-clock multilingual support team ready to assist with any issues,
                        from booking disputes to technical problems, anytime day or night.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Insurance Coverage */}
                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-orange-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Comprehensive Insurance</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Full coverage for vehicle damage, theft, and liability up to ₹10 lakhs per incident.
                        Additional optional coverage available for high-value vehicles.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Real-time Monitoring */}
                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-teal-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Monitoring</h3>
                      <p className="text-gray-600 leading-relaxed">
                        GPS tracking and automated check-ins ensure parking sessions are monitored
                        throughout. Instant alerts for any irregularities or early departures.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators & Stats */}
            <div className="space-y-8">
              {/* Main Trust Card */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 border border-primary/20 shadow-xl">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Star className="w-10 h-10 text-white" />
                  </div>

                  <div>
                    <div className="text-5xl font-black text-primary mb-2">4.9★</div>
                    <p className="text-gray-700 font-semibold">Average Host Rating</p>
                    <p className="text-sm text-gray-600 mt-1">Based on 25,000+ reviews</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-black text-gray-900 mb-1">15K+</div>
                      <div className="text-sm text-gray-600 font-medium">Active Hosts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-gray-900 mb-1">50K+</div>
                      <div className="text-sm text-gray-600 font-medium">Bookings</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Certifications */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">Security Certifications</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-bold text-gray-900">ISO 27001</div>
                    <div className="text-xs text-gray-600">Certified</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-bold text-gray-900">PCI DSS</div>
                    <div className="text-xs text-gray-600">Level 1</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-bold text-gray-900">GDPR</div>
                    <div className="text-xs text-gray-600">Compliant</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-bold text-gray-900">SSL 256-bit</div>
                    <div className="text-xs text-gray-600">Encrypted</div>
                  </div>
                </div>
              </div>

              {/* Trust Message */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-green-900 mb-2">Your Trust is Earned Daily</h4>
                    <p className="text-green-800 text-sm leading-relaxed">
                      We don't just talk about security—we prove it every day through our actions,
                      technology, and commitment to keeping both hosts and renters safe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Assurance */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Sleep Easy Knowing You're Protected
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                While you focus on growing your parking business, we handle all the security, compliance,
                and risk management. Your parking spaces are in safe hands.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Zero fraud incidents in 2024</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>99.99% platform uptime</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Instant dispute resolution</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Host - Mobile-First Responsive */}
      <section className="py-16 sm:py-20 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 px-2">
              Perfect For Every Parking Owner
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
              From homeowners with driveways to commercial operators with parking lots - everyone can earn
            </p>
          </div>

          {/* Mobile: Single column, Tablet: 2 columns, Desktop: 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🏠</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Homeowners</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3">
                Earn ₹500-₹2,000/month from your driveway or garage
              </p>
              <div className="text-primary font-semibold">Perfect for you!</div>
            </div>

            <div className="text-center p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🏢</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Business Owners</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3">
                Turn commercial lots into ₹50,000+ monthly revenue streams
              </p>
              <div className="text-green-600 font-semibold">Scale your business!</div>
            </div>

            <div className="text-center p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🛍️</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Mall Operators</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3">
                Maximize parking facility earnings with 100+ spaces
              </p>
              <div className="text-purple-600 font-semibold">Enterprise solution!</div>
            </div>

            <div className="text-center p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🚗</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Everyone Else</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3">
                Any parking space owner can start earning immediately
              </p>
              <div className="text-orange-600 font-semibold">Join the revolution!</div>
            </div>
          </div>
        </div>
      </section>



      <Footer />

      <HostAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default HostLanding;
