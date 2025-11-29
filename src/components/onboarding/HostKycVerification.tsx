import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Camera, FileText, CheckCircle, AlertCircle, X, ArrowRight, ArrowLeft, Loader2, Shield, CreditCard } from "lucide-react";
import { useOnboardingStore } from "@/hooks/use-onboarding-store";

interface HostKycVerificationProps {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
  onComplete: () => void;
}

export default function HostKycVerification({
  onNext,
  onPrevious,
  isLastStep,
  onComplete
}: HostKycVerificationProps) {
  const { kycDocuments, setKycDocuments } = useOnboardingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileUpload = (type: 'government_id' | 'address_proof' | 'selfie', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;

      // Update the specific document in the store
      const updatedKycDocuments = { ...kycDocuments };
      if (type === 'government_id') {
        updatedKycDocuments.governmentId = file;
        updatedKycDocuments.governmentIdPreview = preview;
      } else if (type === 'address_proof') {
        updatedKycDocuments.addressProof = file;
        updatedKycDocuments.addressProofPreview = preview;
      } else if (type === 'selfie') {
        updatedKycDocuments.selfie = file;
        updatedKycDocuments.selfiePreview = preview;
      }

      setKycDocuments(updatedKycDocuments);
      setErrors({ ...errors, [type]: "" }); // Clear any errors for this document
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (type: 'government_id' | 'address_proof' | 'selfie') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, [type]: "Please upload a valid file (JPEG, PNG, or PDF)" });
        return;
      }

      if (file.size > maxSize) {
        setErrors({ ...errors, [type]: "File size must be less than 5MB" });
        return;
      }

      handleFileUpload(type, file);
    }
  };

  const removeDocument = (type: 'government_id' | 'address_proof' | 'selfie') => {
    const updatedKycDocuments = { ...kycDocuments };
    if (type === 'government_id') {
      updatedKycDocuments.governmentId = null;
      updatedKycDocuments.governmentIdPreview = "";
    } else if (type === 'address_proof') {
      updatedKycDocuments.addressProof = null;
      updatedKycDocuments.addressProofPreview = "";
    } else if (type === 'selfie') {
      updatedKycDocuments.selfie = null;
      updatedKycDocuments.selfiePreview = "";
    }

    setKycDocuments(updatedKycDocuments);
    setErrors({ ...errors, [type]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if all required documents are uploaded (government_id and selfie are required)
    const allUploaded = kycDocuments.governmentIdPreview && kycDocuments.selfiePreview;

    if (!allUploaded) {
      setErrors({ ...errors, general: "Please upload all required documents (Government ID and Selfie)" });
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Upload documents to server and create KYC verification request
      const kycData = {
        governmentId: kycDocuments.governmentId,
        addressProof: kycDocuments.addressProof,
        selfie: kycDocuments.selfie,
        // In real implementation, this would be the uploaded file URLs
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("KYC documents submitted:", kycData);
      onComplete();
    } catch (error) {
      console.error("KYC submission failed:", error);
      setErrors({ ...errors, general: "Failed to submit KYC documents. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDocumentTitle = (type: string) => {
    switch (type) {
      case 'government_id':
        return 'Government ID';
      case 'address_proof':
        return 'Address Proof';
      case 'selfie':
        return 'Selfie with ID';
      default:
        return '';
    }
  };

  const getDocumentDescription = (type: string) => {
    switch (type) {
      case 'government_id':
        return 'Upload a clear photo of your Aadhaar Card, Driver\'s License, Voter ID, or Passport';
      case 'address_proof':
        return 'Upload utility bill, bank statement, or rental agreement (optional but recommended)';
      case 'selfie':
        return 'Take a selfie holding your government ID to verify your identity';
      default:
        return '';
    }
  };

  // Create document array from store data
  const documents = [
    {
      type: 'government_id' as const,
      file: kycDocuments.governmentId,
      preview: kycDocuments.governmentIdPreview,
      status: kycDocuments.governmentIdPreview ? 'uploaded' as const : 'pending' as const,
      required: true
    },
    {
      type: 'address_proof' as const,
      file: kycDocuments.addressProof,
      preview: kycDocuments.addressProofPreview,
      status: kycDocuments.addressProofPreview ? 'uploaded' as const : 'pending' as const,
      required: false
    },
    {
      type: 'selfie' as const,
      file: kycDocuments.selfie,
      preview: kycDocuments.selfiePreview,
      status: kycDocuments.selfiePreview ? 'uploaded' as const : 'pending' as const,
      required: true
    }
  ];

  const allDocumentsUploaded = kycDocuments.governmentIdPreview && kycDocuments.selfiePreview;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Important Notice */}
        <div className="p-4 bg-secondary border border-border rounded-xl">
          <div className="flex items-start space-x-3">
            <CreditCard className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-primary mb-1">Required for Earnings</h4>
              <p className="text-sm text-primary/80 leading-relaxed">
                KYC verification is mandatory to receive payments from your parking spaces.
                Your documents will be reviewed within 24-48 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Document Uploads */}
        <div className="space-y-6">
          {documents.map((doc, index) => (
            <div key={doc.type} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  doc.status === 'uploaded'
                    ? 'bg-secondary text-primary'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {doc.status === 'uploaded' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{getDocumentTitle(doc.type)}</h3>
                  <p className="text-sm text-gray-600">{getDocumentDescription(doc.type)}</p>
                </div>
                {doc.status === 'uploaded' && (
                  <div className="flex items-center text-primary bg-secondary px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Uploaded</span>
                  </div>
                )}
              </div>

              {doc.preview ? (
                <div className="relative ml-11">
                  {doc.file?.type.startsWith('image/') ? (
                    <div className="relative w-full max-w-sm">
                      <img
                        src={doc.preview}
                        alt={`${doc.type} preview`}
                        className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeDocument(doc.type)}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-xl max-w-sm">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.file?.name}</p>
                          <p className="text-xs text-gray-500">
                            {(doc.file?.size || 0) > 1024 * 1024
                              ? `${((doc.file?.size || 0) / (1024 * 1024)).toFixed(1)} MB`
                              : `${((doc.file?.size || 0) / 1024).toFixed(1)} KB`}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.type)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="ml-11">
                  <input
                    type="file"
                    accept={doc.type === 'selfie' ? "image/*" : "image/*,.pdf"}
                    onChange={handleFileSelect(doc.type)}
                    className="hidden"
                    id={`file-${doc.type}`}
                  />
                  <label
                    htmlFor={`file-${doc.type}`}
                    className="inline-flex items-center justify-center w-full max-w-sm h-12 px-4 py-2 bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl cursor-pointer text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {doc.type === 'selfie' ? 'Take or Upload Selfie' : 'Upload Document'}
                  </label>
                  <p className="text-xs text-gray-500 mt-2 ml-1">
                    {doc.type === 'selfie' ? 'JPG, PNG up to 5MB' : 'JPG, PNG, PDF up to 5MB'}
                  </p>
                </div>
              )}

              {errors[doc.type] && (
                <p className="text-sm text-red-600 ml-11">{errors[doc.type]}</p>
              )}
            </div>
          ))}
        </div>

        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="p-4 bg-secondary border border-border rounded-xl">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-primary mb-1">Privacy & Security</h4>
              <p className="text-sm text-primary/80 leading-relaxed">
                Your documents are encrypted and securely stored. We only use this information for identity verification
                and comply with all data protection regulations.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              className="flex-1 h-14 border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <Button
              type="submit"
              className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-xl shadow-sm"
              disabled={isSubmitting || !allDocumentsUploaded}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
