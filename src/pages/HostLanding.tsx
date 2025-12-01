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
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8 sm:space-y-12">
            {/* Headline - Mobile Optimized */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 leading-tight px-2">
                Hey, that empty parking spot
                <span className="block text-primary">in your driveway?</span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-2">
                Yeah, we know it's just sitting there. What if we told you it could pay your electricity bill?
                Or fund your next vacation? That's what we're here for.
              </p>
            </div>

            {/* Host Benefit Cards - Horizontal Scroll Mobile-First */}
            <div className="w-full max-w-6xl mx-auto px-2">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex-shrink-0 w-64 sm:w-72 bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🏠</div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Homes</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Unlock extra monthly income from unused spaces</p>
                </div>

                <div className="flex-shrink-0 w-64 sm:w-72 bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🏢</div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Businesses</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Monetize your underused parking effortlessly</p>
                </div>

                <div className="flex-shrink-0 w-64 sm:w-72 bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🛍️</div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Malls</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Earn more from existing parking infrastructure</p>
                </div>
              </div>

              {/* Scroll Indicator - Mobile Only */}
              <div className="flex justify-center mt-2 sm:hidden">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Trust Indicators - Continuous Auto-Scroll */}
            <div className="w-full max-w-6xl mx-auto px-2 overflow-hidden">
              <div className="flex gap-3 animate-scroll pb-2">
                {/* First set of items */}
                <div className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm flex-shrink-0 w-auto min-w-max">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Trusted by thousands of hosts</span>
                </div>

                <div className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm flex-shrink-0 w-auto min-w-max">
                  <span className="text-blue-600">💼</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Proven platform with high demand</span>
                </div>

                <div className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm flex-shrink-0 w-auto min-w-max">
                  <span className="text-green-600">🔒</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Safe, secure & fully managed</span>
                </div>

                <div className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm flex-shrink-0 w-auto min-w-max">
                  <span className="text-purple-600">⏱️</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Fast onboarding — get listed in minutes</span>
                </div>

                {/* Duplicate set for seamless loop */}
                <div className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm flex-shrink-0 w-auto min-w-max">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Trusted by thousands of hosts</span>
                </div>

                <div className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm flex-shrink-0 w-auto min-w-max">
                  <span className="text-blue-600">💼</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Proven platform with high demand</span>
                </div>

                <div className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm flex-shrink-0 w-auto min-w-max">
                  <span className="text-green-600">🔒</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Safe, secure & fully managed</span>
                </div>

                <div className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm flex-shrink-0 w-auto min-w-max">
                  <span className="text-purple-600">⏱️</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Fast onboarding — get listed in minutes</span>
                </div>
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
                <a href="#how-it-works">
                  How It Works
                </a>
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

          {/* Mobile: 2x2 grid, Laptop: 3x3 grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Scale & Earnings */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">Scale Your Business</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                From 1 spot to 100+. Grow your parking business effortlessly.
              </p>
            </div>

            {/* Security & Trust */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">Bank-Level Security</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Enterprise-grade security protects every transaction.
              </p>
            </div>

            {/* Automation & Ease */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">Set & Forget</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Automated operations handle everything for you.
              </p>
            </div>

            {/* Payments */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">Instant Payouts</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Get paid immediately after each successful booking.
              </p>
            </div>

            {/* Community & Trust */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">Trusted Community</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Join 15,000+ successful hosts already earning.
              </p>
            </div>

            {/* Intelligence */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">Smart Optimization</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                AI-powered pricing maximizes your revenue potential.
              </p>
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
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Earning Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Mobile-First Responsive */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
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

      {/* Trust & Safety - Mobile-First UX Experience */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              Your Safety is Our Priority
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Every aspect of ParkConnect is designed with your security and peace of mind in mind
            </p>
          </div>

          {/* Mobile-First: Trust Score First */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-lg border border-gray-100 mb-8 sm:mb-12">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>

              <div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary mb-2">4.9★</div>
                <p className="text-lg sm:text-xl text-gray-700 font-semibold">Average Host Rating</p>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Based on 25,000+ reviews</p>
              </div>

              <div className="grid grid-cols-2 gap-6 sm:gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2">15K+</div>
                  <div className="text-sm sm:text-base text-gray-600 font-medium">Active Hosts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2">50K+</div>
                  <div className="text-sm sm:text-base text-gray-600 font-medium">Bookings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications & Assurance - Mobile Optimized */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Industry Certifications</h3>

            {/* Security Certifications Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                <div className="text-base sm:text-lg font-bold text-gray-900 mb-1">ISO 27001</div>
                <div className="text-xs sm:text-sm text-gray-600">Certified</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                <div className="text-base sm:text-lg font-bold text-gray-900 mb-1">PCI DSS</div>
                <div className="text-xs sm:text-sm text-gray-600">Level 1</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                <div className="text-base sm:text-lg font-bold text-gray-900 mb-1">GDPR</div>
                <div className="text-xs sm:text-sm text-gray-600">Compliant</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
                <div className="text-base sm:text-lg font-bold text-gray-900 mb-1">SSL 256-bit</div>
                <div className="text-xs sm:text-sm text-gray-600">Encrypted</div>
              </div>
            </div>

            {/* Trust Message */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 sm:p-6 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-2 text-base sm:text-lg">Your Trust is Earned Daily</h4>
                  <p className="text-green-800 text-sm sm:text-base leading-relaxed">
                    We don't just talk about security—we prove it every day through our actions,
                    technology, and commitment to keeping both hosts and renters safe.
                  </p>
                </div>
              </div>
            </div>

            {/* Assurance Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-green-600 mb-1">0</div>
                <div className="text-xs sm:text-sm text-gray-600">Fraud Incidents in 2024</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-blue-600 mb-1">99.99%</div>
                <div className="text-xs sm:text-sm text-gray-600">Platform Uptime</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600">Support Available</div>
              </div>
            </div>
          </div>

          {/* Bottom CTA - Mobile Optimized */}
          <div className="text-center mt-12 sm:mt-16">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Sleep Easy Knowing You're Protected
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
                While you focus on growing your parking business, we handle all the security, compliance,
                and risk management. Your parking spaces are in safe hands.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
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
        </div>
      </section>

      {/* Who Can Host - Black & White Theme */}
      <section className="py-16 sm:py-20 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Perfect For Every Parking Owner
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              From homeowners with driveways to commercial operators with parking lots - everyone can earn
            </p>
          </div>

          {/* Mobile: Single column, Tablet: 2 columns, Desktop: 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-gray-300">
                <span className="text-xl sm:text-2xl">🏠</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Homeowners</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3">
                Earn ₹500-₹2,000/month from your driveway or garage
              </p>
              <div className="text-gray-700 font-semibold">Perfect for you!</div>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-gray-300">
                <span className="text-xl sm:text-2xl">🏢</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Business Owners</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3">
                Turn commercial lots into ₹50,000+ monthly revenue streams
              </p>
              <div className="text-gray-700 font-semibold">Scale your business!</div>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-gray-300">
                <span className="text-xl sm:text-2xl">🛍️</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Mall Operators</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3">
                Maximize parking facility earnings with 100+ spaces
              </p>
              <div className="text-gray-700 font-semibold">Enterprise solution!</div>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-gray-300">
                <span className="text-xl sm:text-2xl">🚗</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Everyone Else</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3">
                Any parking space owner can start earning immediately
              </p>
              <div className="text-gray-700 font-semibold">Join the revolution!</div>
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
