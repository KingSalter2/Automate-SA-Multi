import { useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  MessageSquare, 
  Paperclip, 
  Send, 
  FileText, 
  X,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { mockTickets, Ticket, TicketMessage } from "@/data/mockSupaAdmin";

const SupportPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // Create Ticket State
  const [newTicket, setNewTicket] = useState({
    subject: "",
    priority: "Medium",
    message: ""
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reply State
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const replyFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleReplyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReplyFiles(Array.from(e.target.files));
    }
  };

  const removeReplyFile = (index: number) => {
    setReplyFiles(replyFiles.filter((_, i) => i !== index));
  };

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    const ticketFiles = selectedFiles.map(f => f.name);

    const ticket: Ticket = {
      id: `t${tickets.length + 1}`,
      clientId: 'c1', // Hardcoded for current user context
      subject: newTicket.subject,
      status: 'Open',
      priority: newTicket.priority as 'Low' | 'Medium' | 'High',
      createdAt: new Date(),
      lastMessage: newTicket.message,
      messages: [
        {
          id: `m${Date.now()}`,
          sender: 'user',
          message: newTicket.message,
          timestamp: new Date(),
          attachments: ticketFiles.length > 0 ? ticketFiles : undefined
        }
      ]
    };

    setTickets([ticket, ...tickets]);
    setIsDialogOpen(false);
    setNewTicket({ subject: "", priority: "Medium", message: "" });
    setSelectedFiles([]);
    toast.success("Ticket created successfully");
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;

    if (selectedTicket) {
      setIsReplying(true);
      
      const replyAttachments = replyFiles.map(f => f.name);

      // Simulate network delay
      setTimeout(() => {
        const newMessage: TicketMessage = {
          id: `m${Date.now()}`,
          sender: 'user',
          message: replyMessage,
          timestamp: new Date(),
          attachments: replyAttachments.length > 0 ? replyAttachments : undefined
        };

        const updatedTicket = {
          ...selectedTicket,
          lastMessage: replyMessage,
          messages: [...selectedTicket.messages, newMessage]
        };

        setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
        setSelectedTicket(updatedTicket);
        setReplyMessage("");
        setReplyFiles([]);
        setIsReplying(false);
        toast.success("Reply sent");
      }, 500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground mt-1">
            Get help with your dealership management system.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Describe your issue and attach screenshots if necessary.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="e.g., Cannot upload vehicle images" 
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newTicket.priority} 
                  onValueChange={(val) => setNewTicket({...newTicket, priority: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low - General Question</SelectItem>
                    <SelectItem value="Medium">Medium - Feature Issue</SelectItem>
                    <SelectItem value="High">High - System Blocker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Please describe the issue in detail..." 
                  className="min-h-[120px]"
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Attachments</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full dashed border-2 border-dashed"
                  >
                    <Paperclip className="w-4 h-4 mr-2" />
                    Upload Screenshots / Files
                  </Button>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                        <div className="flex items-center overflow-hidden">
                          <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTicket}>Submit Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Tickets</CardTitle>
            <CardDescription>View and manage your support requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Message</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No tickets found. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedTicket(ticket)}>
                      <TableCell className="font-medium">{ticket.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          ticket.status === 'Open' ? 'text-blue-500 border-blue-500/20' :
                          ticket.status === 'In Progress' ? 'text-yellow-500 border-yellow-500/20' :
                          'text-green-500 border-green-500/20'
                        }>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={
                          ticket.priority === 'High' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' :
                          ticket.priority === 'Medium' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' :
                          'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                        }>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(ticket.createdAt, 'MMM d, yyyy')}</TableCell>
                      <TableCell className="max-w-[300px] truncate text-muted-foreground">
                        {ticket.lastMessage}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(ticket);
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Sheet open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <SheetContent className="w-full sm:max-w-xl flex flex-col p-0">
          {selectedTicket && (
            <>
              <SheetHeader className="p-6 border-b">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={
                    selectedTicket.status === 'Open' ? 'text-blue-500 border-blue-500/20' :
                    selectedTicket.status === 'In Progress' ? 'text-yellow-500 border-yellow-500/20' :
                    'text-green-500 border-green-500/20'
                  }>
                    {selectedTicket.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ID: {selectedTicket.id}
                  </span>
                </div>
                <SheetTitle className="text-xl">{selectedTicket.subject}</SheetTitle>
                <SheetDescription>
                  Created on {format(selectedTicket.createdAt, 'PPP')}
                </SheetDescription>
              </SheetHeader>
              
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {selectedTicket.messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                          {msg.sender === 'user' ? 'ME' : 'SU'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col gap-1 max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">
                            {msg.sender === 'user' ? 'You' : 'Support'}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {format(msg.timestamp, 'p')}
                          </span>
                        </div>
                        <div className={`p-3 rounded-lg text-sm ${
                          msg.sender === 'user' 
                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                            : 'bg-muted rounded-tl-none'
                        }`}>
                          {msg.message}
                        </div>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {msg.attachments.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-1 text-xs bg-muted border rounded px-2 py-1">
                                <ImageIcon className="w-3 h-3" />
                                <span>{file}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t bg-muted/20">
                  <div className="flex flex-col gap-2">
                    {replyFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {replyFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-1 text-xs bg-background border rounded px-2 py-1">
                            <FileText className="w-3 h-3" />
                            <span className="max-w-[100px] truncate">{file.name}</span>
                            <button 
                              onClick={() => removeReplyFile(index)}
                              className="ml-1 text-muted-foreground hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Textarea 
                      placeholder="Type your reply..." 
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-between items-center">
                      <Input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        ref={replyFileInputRef}
                        onChange={handleReplyFileChange}
                        accept="image/*,.pdf"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground"
                        onClick={() => replyFileInputRef.current?.click()}
                      >
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach
                      </Button>
                      <Button onClick={handleSendReply} disabled={!replyMessage.trim() || isReplying}>
                        {isReplying ? 'Sending...' : 'Send Reply'}
                        <Send className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SupportPage;
