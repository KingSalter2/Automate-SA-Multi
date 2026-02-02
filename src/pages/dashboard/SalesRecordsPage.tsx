import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockSoldVehicles, mockSoldLeads } from "@/data/mockSalesData";
import { SalesRecordDialog } from "@/components/dashboard/SalesRecordDialog";
import { Search, Filter, Download, Eye, FileSpreadsheet } from "lucide-react";
import { Vehicle, Lead } from "@/types/vehicle";
import { format, isSameMonth, parseISO } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadCSV } from "@/utils/exportUtils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SalesRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterSalesperson, setFilterSalesperson] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<{vehicle: Vehicle, lead: Lead} | null>(null);

  // Combine data for the table
  const salesRecords = mockSoldVehicles.map(vehicle => {
    const lead = mockSoldLeads.find(l => l.vehicleIds?.includes(vehicle.id));
    return { vehicle, lead };
  }).filter(record => record.lead); // Only show if we have a matching lead

  // Extract unique salespeople
  const salespeople = Array.from(
    new Set(salesRecords.map((r) => r.lead?.assignedTo).filter((v): v is string => Boolean(v)))
  );
  
  // Extract unique months
  const months = Array.from(new Set(salesRecords.map(r => {
    if (!r.lead?.saleDetails?.soldDate) return null;
    return format(r.lead.saleDetails.soldDate, 'yyyy-MM');
  }).filter(Boolean))).sort().reverse();

  const filteredRecords = salesRecords.filter(({ vehicle, lead }) => {
    if (!lead) return false;
    
    // Search Filter
    const searchString = `${vehicle.make} ${vehicle.model} ${lead.customerName} ${vehicle.stockNumber} ${vehicle.vin}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());

    // Month Filter
    let matchesMonth = true;
    if (filterMonth !== "all" && lead.saleDetails?.soldDate) {
      matchesMonth = format(lead.saleDetails.soldDate, 'yyyy-MM') === filterMonth;
    }

    // Salesperson Filter
    let matchesSalesperson = true;
    if (filterSalesperson !== "all") {
      matchesSalesperson = lead.assignedTo === filterSalesperson;
    }

    return matchesSearch && matchesMonth && matchesSalesperson;
  });

  const handleExport = (exportFormat: 'csv' | 'excel') => {
    const extension = exportFormat === 'excel' ? 'xls' : 'csv';
    const dataToExport = filteredRecords.map(({ vehicle, lead }) => ({
      StockNumber: vehicle.stockNumber,
      Make: vehicle.make,
      Model: vehicle.model,
      Variant: vehicle.variant,
      VIN: vehicle.vin,
      Customer: lead?.customerName,
      Phone: lead?.phone,
      Email: lead?.email,
      SalePrice: lead?.saleDetails?.salePrice,
      SoldDate: lead?.saleDetails?.soldDate ? format(lead.saleDetails.soldDate, 'yyyy-MM-dd') : '',
      Salesperson: lead?.assignedTo,
      PaymentType: lead?.saleDetails?.paymentType
    }));
    
    downloadCSV(dataToExport, 'sales_records', extension);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Sales Records</h1>
          <p className="text-muted-foreground">Comprehensive archive of all sold vehicles and transaction history.</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by vehicle, customer, VIN or stock #..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {months.map(month => (
                    <SelectItem key={month} value={month as string}>
                      {format(parseISO(`${month}-01`), 'MMMM yyyy')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterSalesperson} onValueChange={setFilterSalesperson}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  {salespeople.map((person) => (
                    <SelectItem key={person} value={person}>
                      {person}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock #</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Sale Date</TableHead>
                <TableHead>Salesperson</TableHead>
                <TableHead className="text-right">Sale Price</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map(({ vehicle, lead }) => (
                <TableRow key={vehicle.id} className="cursor-pointer hover:bg-secondary/50" onClick={() => lead && setSelectedRecord({ vehicle, lead })}>
                  <TableCell className="font-mono text-xs">{vehicle.stockNumber}</TableCell>
                  <TableCell>
                    <div className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                    <div className="text-xs text-muted-foreground">{vehicle.variant}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{lead?.customerName}</div>
                    <div className="text-xs text-muted-foreground">{lead?.phone}</div>
                  </TableCell>
                  <TableCell>
                    {lead?.saleDetails?.soldDate ? format(lead.saleDetails.soldDate, 'MMM d, yyyy') : '-'}
                  </TableCell>
                  <TableCell>{lead?.assignedTo || '-'}</TableCell>
                  <TableCell className="text-right font-medium">
                    {lead?.saleDetails?.salePrice ? formatCurrency(lead.saleDetails.salePrice) : '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" onClick={(e) => {
                      e.stopPropagation();
                      if (lead) setSelectedRecord({ vehicle, lead });
                    }}>
                      <Eye className="w-4 h-4 text-primary" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No sales records found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedRecord && (
        <SalesRecordDialog 
          isOpen={!!selectedRecord} 
          onClose={() => setSelectedRecord(null)} 
          vehicle={selectedRecord.vehicle}
          lead={selectedRecord.lead}
        />
      )}
    </div>
  );
}
