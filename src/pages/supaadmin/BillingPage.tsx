
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockClients, mockTiers } from "@/data/mockSupaAdmin";
import { format } from "date-fns";
import { AlertCircle, CheckCircle2, DollarSign, TrendingUp, Download } from "lucide-react";
import { toast } from "sonner";

const BillingPage = () => {
  // Calculate stats
  const totalMonthlyRevenue = mockClients.reduce((acc, client) => {
    const tier = mockTiers.find(t => t.name === client.tier);
    return acc + (tier?.price || 0);
  }, 0);

  const activeSubscriptions = mockClients.filter(c => c.status === 'Active').length;
  const overduePayments = mockClients.filter(c => c.status === 'Suspended').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-primary/10 text-primary border-primary/20';
      case 'Suspended': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Onboarding': return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getTierPrice = (tierName: string) => {
    const tier = mockTiers.find(t => t.name === tierName);
    return tier ? tier.price : 0;
  };

  const handleDownloadInvoice = (clientName: string, date: Date) => {
    toast.success(`Downloading invoice for ${clientName} (${format(date, 'MMM yyyy')})`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Billing Overview</h1>
        <p className="text-muted-foreground">Monitor revenue and subscription status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Recurring Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">R {totalMonthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {mockClients.length} total clients
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overduePayments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Client</TableHead>
              <TableHead className="text-muted-foreground">Plan</TableHead>
              <TableHead className="text-muted-foreground">Amount</TableHead>
              <TableHead className="text-muted-foreground">Billing Date</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-right text-muted-foreground">Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockClients.map((client) => (
              <TableRow key={client.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-medium text-foreground">
                  {client.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {client.tier}
                </TableCell>
                <TableCell className="text-foreground">
                  R {getTierPrice(client.tier).toLocaleString()}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(client.nextBillingDate, 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(client.status)}>
                    {client.status === 'Suspended' ? 'Overdue' : 'Paid'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                    onClick={() => handleDownloadInvoice(client.name, new Date())}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Invoice
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BillingPage;
