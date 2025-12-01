import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import Footer from "@/components/layout/Footer";
import FooterRenter from "@/components/layout/FooterRenter";
import { useLocation } from "react-router-dom";
import { Check, Star, Zap, Crown, Building, Car, Calculator, TrendingUp } from "lucide-react";

const Pricing = () => {
  const location = useLocation();
  const isHostPage = location.pathname.includes('/host');

  const pricingPlans = [
    {
      name: "Starter",
      icon: Car,
      price: "₹499",
      period: "/month",
      description: "Perfect for homeowners with 1-2 parking spots",
      features: [
        "Up to 2 parking spots",
        "Basic listing management",
        "Standard customer support",
        "Mobile app access",
        "Basic analytics",
        "Email notifications"
      ],
      popular: false,
      buttonText: "Start Free Trial",
      buttonVariant: "outline" as const
    },
    {
      name: "Professional",
      icon: Building,
      price: "₹1,499",
      period: "/month",
      description: "Ideal for small businesses and multi-spot owners",
      features: [
        "Up to 10 parking spots",
        "Advanced listing management",
        "Priority customer support",
        "Mobile app access",
        "Detailed analytics & insights",
        "SMS & email notifications",
        "Custom pricing rules",
        "Reservation management",
        "Payment reconciliation"
      ],
      popular: true,
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: "₹4,999",
      period: "/month",
      description: "For large parking operators and commercial lots",
      features: [
        "Unlimited parking spots",
        "White-label solution",
        "Dedicated account manager",
        "24/7 priority support",
        "Advanced analytics & reporting",
        "API access",
        "Custom integrations",
        "Bulk operations",
        "Multi-location management",
        "Revenue optimization tools"
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showSearchBar={false} />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                Host Pricing Plans
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Choose the Perfect Plan
                <span className="block text-primary">for Your Parking Business</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Start earning from your parking spaces with our flexible pricing plans.
                No setup fees, no hidden costs, just transparent pricing designed for your success.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Free Trial</h3>
                <p className="text-sm text-gray-600">14 days to test our platform</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">No Setup Fees</h3>
                <p className="text-sm text-gray-600">Start earning immediately</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Scale Anytime</h3>
                <p className="text-sm text-gray-600">Upgrade or downgrade easily</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {pricingPlans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`relative p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    index === 0 ? 'bg-blue-100' :
                    index === 1 ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    <plan.icon className={`w-8 h-8 ${
                      index === 0 ? 'text-blue-600' :
                      index === 1 ? 'text-green-600' : 'text-purple-600'
                    }`} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="w-full"
                  variant={plan.buttonVariant}
                  size="lg"
                >
                  <Link to={plan.buttonText === "Contact Sales" ? "/contact" : "/host"}>
                    {plan.buttonText}
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Calculate Your Potential Earnings
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how much you could earn with different parking scenarios
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Residential Driveway</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily rate:</span>
                    <span className="font-semibold">₹50-80</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average occupancy:</span>
                    <span className="font-semibold">60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly earnings:</span>
                    <span className="font-bold text-green-600">₹900-1,440</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Commercial Parking Lot</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily rate per spot:</span>
                    <span className="font-semibold">₹30-50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">50 spots × occupancy:</span>
                    <span className="font-semibold">70%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly earnings:</span>
                    <span className="font-bold text-green-600">₹31,500-52,500</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-6">
                <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Custom Calculator</h3>
                <p className="text-gray-600">
                  Use our advanced calculator to estimate your potential earnings based on your specific situation.
                </p>
              </div>
              <Button asChild className="w-full" size="lg">
                <Link to="/coming-soon">Try Calculator</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Compare All Features
            </h2>
            <p className="text-lg text-gray-600">
              See what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Professional</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Parking Spots", starter: "Up to 2", professional: "Up to 10", enterprise: "Unlimited" },
                  { feature: "Mobile App Access", starter: "✓", professional: "✓", enterprise: "✓" },
                  { feature: "Analytics Dashboard", starter: "Basic", professional: "Advanced", enterprise: "Custom" },
                  { feature: "Customer Support", starter: "Email", professional: "Priority", enterprise: "24/7 Dedicated" },
                  { feature: "API Access", starter: "✗", professional: "✗", enterprise: "✓" },
                  { feature: "White-label Solution", starter: "✗", professional: "✗", enterprise: "✓" },
                  { feature: "Custom Integrations", starter: "✗", professional: "Basic", enterprise: "Full" },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.starter}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.professional}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Pricing FAQ
            </h2>
            <p className="text-lg text-gray-600">
              Common questions about our pricing and billing
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial available?
              </h3>
              <p className="text-gray-600">
                Yes! We offer a 14-day free trial for all plans. No credit card required to get started.
                You'll have full access to all features during your trial period.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect
                immediately, and we'll prorate any billing adjustments.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, UPI, net banking, and digital wallets.
                All payments are processed securely through our PCI DSS compliant payment gateway.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a setup fee or hidden costs?
              </h3>
              <p className="text-gray-600">
                No setup fees, no hidden costs. The price you see is what you pay. We also don't charge
                any commission on bookings - you keep 100% of your earnings.
              </p>
            </div>
          </div>
        </div>
      </section>
      {isHostPage ? <Footer /> : <FooterRenter />}
    </div>
  );
};

export default Pricing;
