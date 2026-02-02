import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FinanceCalculator } from '@/components/finance/FinanceCalculator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle2, 
  FileText, 
  Clock, 
  Shield, 
  Users,
  ArrowRight,
  Upload
} from 'lucide-react';

const FinancePage = () => {
  const steps = [
    { icon: FileText, title: 'Apply Online', desc: 'Complete our simple application form' },
    { icon: Clock, title: 'Quick Approval', desc: 'Get a decision in under 30 minutes' },
    { icon: CheckCircle2, title: 'Choose Your Car', desc: 'Select from our premium vehicles' },
    { icon: Users, title: 'Drive Away', desc: 'Collect your new vehicle' },
  ];

  const requirements = [
    'Valid South African ID',
    'Proof of residence (not older than 3 months)',
    'Latest 3 months bank statements',
    'Latest 3 months payslips',
    'Proof of employment',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4 text-primary border-primary">Vehicle Finance</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Flexible Finance
              <span className="block text-gradient-primary">Made Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Get pre-approved in minutes with competitive rates from South Africa's leading banks
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <Card variant="feature" className="p-6 text-center h-full">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </Card>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Calculator & Application */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <FinanceCalculator />

            {/* Application Form */}
            <Card variant="feature">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
                    <FileText className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl">Apply Now</h3>
                    <p className="text-sm text-muted-foreground font-normal">Quick pre-approval application</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input type="tel" placeholder="082 123 4567" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">ID Number</label>
                  <Input placeholder="8501015800086" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gross Monthly Income</label>
                  <Input type="number" placeholder="45000" />
                </div>

                <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                  <label className="text-sm font-medium mb-3 block">Upload Documents</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop files or <span className="text-primary">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>

                <Button variant="hero" size="lg" className="w-full">
                  Submit Application
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting, you agree to our terms and privacy policy
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Requirements */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold">What You'll Need</h2>
              <p className="text-muted-foreground mt-2">Required documents for your application</p>
            </div>
            <Card variant="glass" className="p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{req}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FinancePage;
