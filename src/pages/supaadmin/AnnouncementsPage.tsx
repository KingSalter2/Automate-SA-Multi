import { useState } from "react";
import { 
  Megaphone, 
  Plus, 
  Calendar, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAnnouncements, Announcement } from "@/data/mockSupaAdmin";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>({
    type: 'Info',
    targetAudience: 'All',
    status: 'Draft'
  });

  const handleCreate = () => {
    const announcement: Announcement = {
      id: `an${Date.now()}`,
      title: newAnnouncement.title || 'Untitled',
      message: newAnnouncement.message || '',
      type: newAnnouncement.type as Announcement['type'],
      targetAudience: newAnnouncement.targetAudience as Announcement['targetAudience'],
      status: 'Sent', // Auto-send for prototype
      sentAt: new Date(),
      author: 'You'
    };
    
    setAnnouncements([announcement, ...announcements]);
    setIsDialogOpen(false);
    setNewAnnouncement({ type: 'Info', targetAudience: 'All', status: 'Draft' });
    toast.success("Announcement broadcasted successfully");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'Success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'Critical': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Warning': return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case 'Success': return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'Critical': return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Announcements</h1>
          <p className="text-muted-foreground">Broadcast messages to your dealership clients.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Announcement
        </Button>
      </div>

      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-start gap-4">
                <div className={cn("p-2 rounded-lg border", getTypeColor(announcement.type))}>
                  {getTypeIcon(announcement.type)}
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {announcement.title}
                    <Badge variant="outline" className="ml-2 font-normal text-xs">
                      {announcement.targetAudience}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {announcement.sentAt ? format(announcement.sentAt, 'PPP p') : 'Scheduled'}
                    </span>
                    <span>•</span>
                    <span>By {announcement.author}</span>
                  </CardDescription>
                </div>
              </div>
              <Badge variant={announcement.status === 'Sent' ? 'secondary' : 'outline'}>
                {announcement.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed pl-[3.25rem]">
                {announcement.message}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Broadcast New Message</DialogTitle>
            <DialogDescription>
              Send a system-wide notification to your clients.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Subject</Label>
              <Input 
                id="title" 
                placeholder="e.g., Scheduled Maintenance" 
                value={newAnnouncement.title || ''}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={newAnnouncement.type} 
                  onValueChange={(val) => setNewAnnouncement({...newAnnouncement, type: val as Announcement['type']})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Info">Info</SelectItem>
                    <SelectItem value="Success">Success</SelectItem>
                    <SelectItem value="Warning">Warning</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="audience">Audience</Label>
                <Select 
                  value={newAnnouncement.targetAudience} 
                  onValueChange={(val) => setNewAnnouncement({...newAnnouncement, targetAudience: val as Announcement['targetAudience']})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Clients</SelectItem>
                    <SelectItem value="Active">Active Only</SelectItem>
                    <SelectItem value="Beta Users">Beta Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Type your message here..." 
                className="min-h-[100px]"
                value={newAnnouncement.message || ''}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, message: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="gap-2">
              <Send className="w-4 h-4" />
              Broadcast Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementsPage;
