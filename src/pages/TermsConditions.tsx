import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/layout/Footer";
import FooterRenter from "@/components/layout/FooterRenter";
import { useLocation } from "react-router-dom";
import { FileText, Scale, AlertTriangle, Shield } from "lucide-react";

const TermsConditions = () => {
  const location = useLocation();
  const isHostPage = location.pathname.includes('/host');

  return (
    <div className="min-h-screen bg-background">
      <Header showSearchBar={false} />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Terms & Conditions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using ParkConnect services.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: December 1, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Welcome to ParkConnect. These Terms and Conditions ("Terms") govern your use of our parking reservation platform and related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
              </p>
              <p className="text-gray-600 leading-relaxed">
                If you do not agree to these Terms, please do not use our Services. We reserve the right to modify these Terms at any time, and your continued use of the Services constitutes acceptance of any changes.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definitions</h2>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>"Platform"</strong> means the ParkConnect website, mobile application, and related services</li>
                <li><strong>"Host"</strong> means a user who lists parking spaces for rent on the Platform</li>
                <li><strong>"Renter"</strong> means a user who books parking spaces through the Platform</li>
                <li><strong>"User"</strong> means any individual who accesses or uses the Platform</li>
                <li><strong>"Parking Space"</strong> means any parking area listed by a Host for rent</li>
                <li><strong>"Booking"</strong> means a confirmed reservation for a Parking Space</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Eligibility</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To use our Services, you must:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Be at least 18 years old</li>
                <li>Have a valid driver's license</li>
                <li>Provide accurate and complete registration information</li>
                <li>Have the legal capacity to enter into binding agreements</li>
                <li>Not be prohibited from using the Services under applicable laws</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Hosts must additionally own or have legal authority to rent the Parking Space they list.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Account Registration and Security</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Provide accurate and current information during registration</li>
                <li>Update your information to keep it accurate and current</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be responsible for all activities conducted through your account</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Host Responsibilities</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Listing Accuracy</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Hosts must provide accurate and complete information about their Parking Spaces, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Location, accessibility, and parking conditions</li>
                <li>Availability, pricing, and any restrictions</li>
                <li>High-quality photos showing the actual parking space</li>
                <li>Any rules or special instructions for renters</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Space Maintenance</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Hosts are responsible for ensuring their Parking Spaces are:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Safe and accessible during booked times</li>
                <li>Clean and free from obstructions</li>
                <li>Compliant with local parking regulations</li>
                <li>Properly marked and identifiable</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Availability and Cancellations</h3>
              <p className="text-gray-600 leading-relaxed">
                Hosts must honor confirmed Bookings and may only cancel under extraordinary circumstances. Cancellations must be communicated immediately to affected Renters.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Renter Responsibilities</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Booking and Payment</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Renters agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Provide valid payment information for all Bookings</li>
                <li>Pay all fees associated with their Bookings</li>
                <li>Arrive on time and follow parking space rules</li>
                <li>Respect the Host's property and neighboring properties</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Vehicle and Conduct</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Renters must ensure their vehicle:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Is legally registered and insured</li>
                <li>Does not exceed the parking space dimensions</li>
                <li>Does not cause damage to the parking area</li>
                <li>Is parked safely and legally</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Payment Terms</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Fees and Charges</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                ParkConnect charges a service fee for facilitating parking reservations. The fee structure is:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>Host Fee:</strong> 10% of the booking amount (transparent pricing)</li>
                <li><strong>Renter Fee:</strong> Included in the total booking price</li>
                <li><strong>Payment Processing:</strong> Handled through secure third-party providers</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Payment Processing</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Payments are processed securely through PCI DSS compliant providers. Funds are held in escrow until the parking session is completed successfully. Hosts receive payments within 24-48 hours after session completion.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.3 Refunds and Disputes</h3>
              <p className="text-gray-600 leading-relaxed">
                Refunds are processed according to our refund policy. Disputes are resolved through our mediation process, which considers both Host and Renter perspectives.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cancellations and Refunds</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.1 Cancellation Policy</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>Free Cancellation:</strong> Up to 24 hours before booking start time</li>
                <li><strong>Partial Refund:</strong> 50% refund for cancellations within 24 hours</li>
                <li><strong>No Refund:</strong> For cancellations within 2 hours of start time</li>
                <li><strong>Host Cancellation:</strong> Full refund to renter, host may be penalized</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.2 Refund Processing</h3>
              <p className="text-gray-600 leading-relaxed">
                Approved refunds are processed within 5-7 business days. Refunds are issued to the original payment method.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Liability and Insurance</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">9.1 Platform Liability</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                ParkConnect acts as a platform connecting Hosts and Renters. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Actions or omissions of Hosts or Renters</li>
                <li>Condition or safety of Parking Spaces</li>
                <li>Damage to vehicles or property</li>
                <li>Disputes between Users</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">9.2 User Responsibility</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Users are responsible for their own actions and assume all risks associated with parking transactions. We recommend:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Renters should inspect parking spaces before booking</li>
                <li>Hosts should maintain safe and accessible parking areas</li>
                <li>All users should document the condition of vehicles and spaces</li>
                <li>Users should report any issues immediately</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">9.3 Insurance Coverage</h3>
              <p className="text-gray-600 leading-relaxed">
                We provide basic insurance coverage for verified transactions. Users are encouraged to maintain their own comprehensive insurance coverage for vehicles and property.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Prohibited Activities</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Users are prohibited from:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Using the Platform for illegal activities</li>
                <li>Providing false or misleading information</li>
                <li>Harassing or threatening other users</li>
                <li>Attempting to circumvent our payment system</li>
                <li>Sharing account credentials with others</li>
                <li>Creating multiple accounts for deceptive purposes</li>
                <li>Uploading malicious content or viruses</li>
                <li>Violating intellectual property rights</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The Platform and its content are protected by copyright, trademark, and other intellectual property laws. Users retain ownership of content they upload but grant ParkConnect a license to use such content for platform operations.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account for violations of these Terms. Upon termination:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Your access to the Platform will be immediately revoked</li>
                <li>Outstanding Bookings may be canceled</li>
                <li>Pending payments will be processed according to our policies</li>
                <li>You remain liable for any obligations incurred before termination</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Dispute Resolution</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">13.1 Mediation Process</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We provide a mediation service for disputes between Hosts and Renters. Our team reviews evidence from both parties and makes binding decisions within 48 hours.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">13.2 Governing Law</h3>
              <p className="text-gray-600 leading-relaxed">
                These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To the maximum extent permitted by law, ParkConnect shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Services. Our total liability shall not exceed the amount paid by you for the specific transaction giving rise to the claim.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your personal information. By using our Services, you consent to our data practices as described in the Privacy Policy.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may modify these Terms at any time. Material changes will be communicated via email or platform notifications. Your continued use of the Services after changes take effect constitutes acceptance of the modified Terms.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Legal Department</h4>
                    <p className="text-gray-600">legal@parkconnect.in</p>
                    <p className="text-gray-600">+91 1800-XXX-LEGAL</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Registered Office</h4>
                    <p className="text-gray-600">
                      ParkConnect HQ<br />
                      123 Tech Park Road<br />
                      Whitefield, Bangalore - 560066<br />
                      Karnataka, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <p className="text-sm text-gray-500 text-center">
                By using ParkConnect, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {isHostPage ? <Footer /> : <FooterRenter />}
    </div>
  );
};

export default TermsConditions;
