import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import Footer from "@/components/layout/Footer";
import { CategorySection } from "@/components/CategorySection";
import { ParkingSpace } from "@/types";
import { redirectToLogin, isLoggedIn } from "@/utils/auth";

// Mock data for different categories
const mockParkingSpots: ParkingSpace[] = [
  {
    id: '1',
    hostId: 'host1',
    title: 'Connaught Place Parking',
    description: 'Secure underground parking in the heart of Delhi',
    address: {
      street: 'Radial Road 5',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    },
    location: { latitude: 28.6315, longitude: 77.2167 },
    images: ['https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop'],
    features: [],
    pricing: { hourly: 30, daily: 200, monthly: 4000, currency: 'INR' },
    availability: [],
    rating: 4.5,
    reviewCount: 128,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    hostId: 'host2',
    title: 'Karol Bagh Multi-level',
    description: 'Spacious parking with CCTV surveillance',
    address: {
      street: 'Pusa Road',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110005',
      country: 'India'
    },
    location: { latitude: 28.6517, longitude: 77.1892 },
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],
    features: [],
    pricing: { hourly: 25, daily: 150, monthly: 3000, currency: 'INR' },
    availability: [],
    rating: 4.2,
    reviewCount: 89,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    hostId: 'host3',
    title: 'Rajouri Garden Plaza',
    description: 'Premium parking spot with easy access',
    address: {
      street: 'Rajouri Garden Main Market',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110027',
      country: 'India'
    },
    location: { latitude: 28.6478, longitude: 77.1234 },
    images: ['https://images.unsplash.com/photo-1494526585095-c41746248156?w=400&h=300&fit=crop'],
    features: [],
    pricing: { hourly: 35, daily: 250, monthly: 5000, currency: 'INR' },
    availability: [],
    rating: 4.7,
    reviewCount: 203,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    hostId: 'host4',
    title: 'Lajpat Nagar Market',
    description: 'Convenient street parking in residential area',
    address: {
      street: 'Lajpat Nagar Central Market',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110024',
      country: 'India'
    },
    location: { latitude: 28.5783, longitude: 77.2437 },
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop'],
    features: [],
    pricing: { hourly: 20, daily: 120, monthly: 2500, currency: 'INR' },
    availability: [],
    rating: 4.0,
    reviewCount: 67,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Add more spots for variety
  {
    id: '5',
    hostId: 'host5',
    title: 'CP Premium Parking',
    description: 'Valet parking service in Connaught Place',
    address: {
      street: 'Connaught Circus',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    },
    location: { latitude: 28.6300, longitude: 77.2170 },
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],
    features: [],
    pricing: { hourly: 50, daily: 300, monthly: 6000, currency: 'INR' },
    availability: [],
    rating: 4.8,
    reviewCount: 312,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    hostId: 'host6',
    title: 'Budget Parking Hub',
    description: 'Affordable parking for daily commuters',
    address: {
      street: 'Nehru Place',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110019',
      country: 'India'
    },
    location: { latitude: 28.5494, longitude: 77.2515 },
    images: ['https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop'],
    features: [],
    pricing: { hourly: 15, daily: 80, monthly: 1800, currency: 'INR' },
    availability: [],
    rating: 3.8,
    reviewCount: 45,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Airbnb-style parking categories
const categories = [
  {
    title: 'Parking spots near you',
    subtitle: 'Convenient locations in your area',
    spots: mockParkingSpots.slice(0, 6)
  },
  {
    title: 'Available slots in Koramangala',
    subtitle: 'Popular area with great parking options',
    spots: mockParkingSpots.slice(1, 7)
  },
  {
    title: 'Budget parkings under ₹30/hr',
    subtitle: 'Affordable parking without compromising quality',
    spots: mockParkingSpots.filter(spot => spot.pricing.hourly <= 30).slice(0, 6)
  },
  {
    title: 'Indoor parkings in Bangalore',
    subtitle: 'Protected and secure parking spaces',
    spots: mockParkingSpots.filter(spot => spot.rating >= 4.0).slice(0, 6)
  },
  {
    title: 'Safe & Secured Car Parking',
    subtitle: 'CCTV monitored and gated parking',
    spots: mockParkingSpots.filter(spot => spot.rating >= 4.2).slice(0, 6)
  },
  {
    title: 'Verified Host Parkings',
    subtitle: 'Trusted hosts with excellent reviews',
    spots: mockParkingSpots.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6)
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleBook = (spotId: string) => {
    if (!isLoggedIn()) {
      redirectToLogin(`/parking/${spotId}/book`);
    } else {
      // Navigate to booking page
      navigate(`/parking/${spotId}/book`);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Airbnb-Style Header with Integrated Search */}
      <Header showSearchBar={true} />

      {/* Main Content - Adjusted padding for taller header */}
      <main className="pt-28 pb-8">
        <div className="container-mobile">
        {/* Airbnb-Style Horizontal Scroll Categories */}
        <div className="space-y-8">
          {categories.map((category, index) => (
            <CategorySection
              key={index}
              title={category.title}
              subtitle={category.subtitle}
              spots={category.spots}
              onBook={handleBook}
            />
          ))}
        </div>

        {/* Stats Section */}
        <section className="mt-16 py-12 bg-muted/30 rounded-2xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Join 10,000+ Happy Drivers
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              ParkConnect makes finding parking simple and stress-free. Join our community today.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Drivers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Parking Spots</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">4.6★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
