import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, CheckCircle2, FileText, Smartphone, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { mockLeads } from "@/data/mockLeads";

export default function DocumentUploadPage() {
  const { leadId } = useParams();
  const { toast } = useToast();
  
  // States
  const [step, setStep] = useState<'verify' | 'upload' | 'success'>('verify');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [completedUploads, setCompletedUploads] = useState<Record<string, boolean>>({});

  // Mock lead data (in real app, fetch from API)
  const lead = mockLeads.find(l => l.id === leadId) || { customerName: "Valued Client", phone: "082 555 1234" };

  const requiredDocs = [
    { id: 'id_doc', label: 'ID Document', description: 'Clear copy of Green ID Book or Smart Card (both sides)' },
    { id: 'payslip', label: 'Latest Payslip', description: 'Your most recent payslip' },
    { id: 'bank_statements', label: '3 Months Bank Statements', description: 'Latest 3 months stamped statements' },
    { id: 'proof_emp', label: 'Proof of Employment', description: 'Letter from employer confirming employment' },
    { id: 'proof_res', label: 'Proof of Residence', description: 'Utility bill or account statement (< 3 months old)' },
  ];

  const handleVerify = () => {
    setIsVerifying(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      // Simple mock validation: accept any number for demo purposes
      // In real app: check if phoneNumber matches lead.phone
      if (phoneNumber.length >= 10) {
        setStep('upload');
        toast({
          title: "Verified Successfully",
          description: "Please proceed to upload your documents.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "Please enter a valid cell phone number.",
        });
      }
    }, 1500);
  };

  const handleFileUpload = (docId: string, file: File) => {
    // Validate file
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
      });
      return;
    }

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(prev => ({ ...prev, [docId]: progress }));
      
      if (progress >= 100) {
        clearInterval(interval);
        setCompletedUploads(prev => ({ ...prev, [docId]: true }));
        toast({
          title: "Upload Complete",
          description: `${file.name} has been uploaded successfully.`,
        });
      }
    }, 200);
  };

  const allUploaded = requiredDocs.every(doc => completedUploads[doc.id]);

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Documents Submitted!</CardTitle>
            <CardDescription>
              Thank you, {lead.customerName}. We have received your documents securely.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our team will review your application and get back to you shortly.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => window.close()}>Close Window</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Header Logo Area */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Secure Document Portal</h1>
          <p className="text-muted-foreground">Upload your required documents safely and securely</p>
        </div>

        {step === 'verify' && (
          <Card className="w-full max-w-md mx-auto shadow-lg border-primary/10">
            <CardHeader>
              <CardTitle>Identity Verification</CardTitle>
              <CardDescription>
                Please enter your cell phone number to access your document upload portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Cell Phone Number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    placeholder="082 123 4567" 
                    className="pl-9" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleVerify} 
                disabled={isVerifying || !phoneNumber}
              >
                {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isVerifying ? "Verifying..." : "Verify & Continue"}
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 'upload' && (
          <Card className="w-full shadow-lg border-primary/10">
            <CardHeader className="border-b bg-card/50">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Required Documents</CardTitle>
                  <CardDescription className="mt-1">
                    Please upload the following documents. Ensure images are clear and text is readable.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary px-3 py-1.5 rounded-md border">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Max 5MB per file
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {requiredDocs.map((doc) => (
                <div key={doc.id} className="p-4 rounded-lg border bg-card hover:bg-secondary/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{doc.label}</h4>
                        {completedUploads[doc.id] && (
                          <span className="text-green-600 text-xs font-medium flex items-center gap-0.5 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Uploaded
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                    </div>

                    <div className="flex-shrink-0 w-full md:w-auto">
                      {!completedUploads[doc.id] ? (
                        <div className="relative">
                          <input
                            type="file"
                            id={`file-${doc.id}`}
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(doc.id, file);
                            }}
                          />
                          <Label
                            htmlFor={`file-${doc.id}`}
                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all ${uploadProgress[doc.id] > 0 ? 'opacity-50 pointer-events-none' : ''}`}
                          >
                            <Upload className="w-4 h-4" />
                            {uploadProgress[doc.id] > 0 ? 'Uploading...' : 'Select File'}
                          </Label>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700 w-full md:w-auto">
                          Change File
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {uploadProgress[doc.id] > 0 && uploadProgress[doc.id] < 100 && (
                    <div className="mt-3">
                      <Progress value={uploadProgress[doc.id]} className="h-1.5" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter className="bg-secondary/10 p-6 flex justify-end gap-3 border-t">
              <Button variant="ghost" onClick={() => setStep('verify')}>Back</Button>
              <Button 
                onClick={() => setStep('success')} 
                disabled={!allUploaded}
                className={allUploaded ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Submit Documents
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
