
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
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Paperclip, 
  Send, 
  FileText, 
  X,
  Search,
  Filter,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { mockTickets, mockClients, Ticket, TicketMessage } from "@/data/mockSupaAdmin";

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // Reply State
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const replyFileInputRef = useRef<HTMLInputElement>(null);

  const getClientName = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    return client ? client.name : "Unknown Client";
  };

  const handleReplyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReplyFiles(Array.from(e.target.files));
    }
  };

  const removeReplyFile = (index: number) => {
    setReplyFiles(replyFiles.filter((_, i) => i !== index));
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
          sender: 'support', // Admin always replies as support
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

  const handleStatusChange = (ticketId: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    const updatedTickets = tickets.map(t => 
      t.id === ticketId ? { ...t, status: newStatus } : t
    );
    setTickets(updatedTickets);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
    toast.success(`Ticket status updated to ${newStatus}`);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClientName(ticket.clientId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and resolve support tickets from all clients.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets by subject, ID, or client..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
          <CardDescription>
            {filteredTickets.length} tickets found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No tickets found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedTicket(ticket)}>
                    <TableCell className="font-medium">
                      {getClientName(ticket.clientId)}
                      <div className="text-xs text-muted-foreground">ID: {ticket.id}</div>
                    </TableCell>
                    <TableCell>{ticket.subject}</TableCell>
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
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
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

      <Sheet open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <SheetContent className="w-full sm:max-w-xl flex flex-col p-0">
          {selectedTicket && (
            <>
              <SheetHeader className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <SheetTitle className="text-xl">{selectedTicket.subject}</SheetTitle>
                    <SheetDescription>
                      {getClientName(selectedTicket.clientId)} • Created on {format(selectedTicket.createdAt, 'PPP')}
                    </SheetDescription>
                  </div>
                  <Select 
                    value={selectedTicket.status} 
                    onValueChange={(val) => handleStatusChange(selectedTicket.id, val as 'Open' | 'In Progress' | 'Resolved')}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SheetHeader>
              
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {selectedTicket.messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex gap-4 ${msg.sender === 'support' ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={msg.sender === 'support' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                          {msg.sender === 'support' ? 'SU' : 'CL'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col gap-1 max-w-[80%] ${msg.sender === 'support' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">
                            {msg.sender === 'support' ? 'Support (You)' : getClientName(selectedTicket.clientId)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {format(msg.timestamp, 'p')}
                          </span>
                        </div>
                        <div className={`p-3 rounded-lg text-sm ${
                          msg.sender === 'support' 
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

export default TicketsPage;
