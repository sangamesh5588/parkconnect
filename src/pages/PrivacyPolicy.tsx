import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/layout/Footer";
import FooterRenter from "@/components/layout/FooterRenter";
import { useLocation } from "react-router-dom";
import { Shield, Eye, Lock, Users, Database, Mail } from "lucide-react";

const PrivacyPolicy = () => {
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
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                ParkConnect ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our parking reservation platform and related services.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We collect personal information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Name, email address, and phone number</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Driver's license information for verification purposes</li>
                <li>Vehicle information (make, model, license plate)</li>
                <li>Address and location data for parking services</li>
                <li>Profile pictures and identification documents</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you use our services, we automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>Location data for parking availability and navigation</li>
                <li>Parking session data (entry/exit times, duration, fees)</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Providing and maintaining our parking reservation services</li>
                <li>Processing payments and managing transactions</li>
                <li>Verifying user identities and preventing fraud</li>
                <li>Communicating with you about your bookings and account</li>
                <li>Improving our services and developing new features</li>
                <li>Ensuring platform security and compliance</li>
                <li>Resolving disputes and providing customer support</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>With Service Providers:</strong> Trusted third-party service providers who assist us in operating our platform</li>
                <li><strong>Between Users:</strong> Basic contact information shared between hosts and renters for parking transactions</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We implement comprehensive security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>End-to-end encryption for data transmission</li>
                <li>Secure data storage with regular backups</li>
                <li>Access controls and employee training</li>
                <li>Regular security audits and updates</li>
                <li>PCI DSS compliance for payment processing</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                To exercise these rights, please contact us at privacy@parkconnect.in
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience on our platform:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our services</li>
                <li><strong>Marketing Cookies:</strong> Used to show relevant advertisements</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                You can control cookie preferences through your browser settings.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Generally, we retain:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Account information while your account is active</li>
                <li>Transaction records for 7 years for tax and legal compliance</li>
                <li>Communication records for 3 years</li>
                <li>Verification documents as required by law</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-600 leading-relaxed">
                Your information may be transferred to and processed in countries other than India. We ensure appropriate safeguards are in place to protect your data during such transfers, including standard contractual clauses and adequacy decisions.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Email notification to your registered email address</li>
                <li>Prominent notice on our platform</li>
                <li>Updating the "Last updated" date at the top of this policy</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Data Protection Officer</h4>
                    <p className="text-gray-600">privacy@parkconnect.in</p>
                    <p className="text-gray-600">+91 1800-XXX-PRIVACY</p>
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
                This Privacy Policy is governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
              </p>
            </div>
          </div>
        </div>
      </section>

      {isHostPage ? <Footer /> : <FooterRenter />}
    </div>
  );
};

export default PrivacyPolicy;
