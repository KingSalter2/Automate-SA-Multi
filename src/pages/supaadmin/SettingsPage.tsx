import { useState, useRef } from "react";
import { 
  Save, 
  Shield, 
  Bell, 
  Lock, 
  Globe, 
  Mail, 
  Palette,
  CreditCard,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/placeholder-logo.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, we would upload this to a server/storage bucket
      // For now, we'll just display it locally
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
        toast.success("Logo updated successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground">Manage global configuration and preferences.</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
          {!isLoading && <Save className="ml-2 w-4 h-4" />}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Identity</CardTitle>
              <CardDescription>Configure the platform name, logo, and branding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border">
                  <AvatarImage src={logoUrl} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">SA</AvatarFallback>
                </Avatar>
                <div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <Button variant="outline" onClick={handleLogoClick}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 512x512px PNG or JPG</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="Automate SA" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" defaultValue="support@automate.sa" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="footer-text">Footer Text</Label>
                <Input id="footer-text" defaultValue="© 2024 Automate SA. All rights reserved." />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>Temporarily disable access for all users except super admins.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Users will see a maintenance page when trying to login.</p>
              </div>
              <Switch />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Policy</CardTitle>
              <CardDescription>Set requirements for user passwords and sessions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication (2FA)</Label>
                  <p className="text-sm text-muted-foreground">Enforce 2FA for all admin accounts.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="60" className="max-w-[200px]" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                <Input id="password-expiry" type="number" defaultValue="90" className="max-w-[200px]" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Configure which events trigger system-wide notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>New Client Registration</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Critical Error Reports</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Payment Failures</Label>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Manage your email delivery settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" defaultValue="smtp.example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" defaultValue="587" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtp-user">Username</Label>
                <Input id="smtp-user" defaultValue="notifications@automate.sa" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtp-key">API Key</Label>
                <Input id="smtp-key" type="password" value="************************" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway</CardTitle>
              <CardDescription>Configure Stripe or other payment providers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid gap-2">
                <Label htmlFor="stripe-key">Stripe Public Key</Label>
                <Input id="stripe-key" defaultValue="pk_test_..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stripe-secret">Stripe Secret Key</Label>
                <Input id="stripe-secret" type="password" value="sk_test_..." />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Switch defaultChecked />
                <Label>Test Mode</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default SettingsPage;