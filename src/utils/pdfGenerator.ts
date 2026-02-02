import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Lead, Vehicle } from '@/types/vehicle';
import { format } from 'date-fns';

type JsPDFWithAutoTable = jsPDF & {
  lastAutoTable: {
    finalY: number;
  };
};

const COMPANY_INFO = {
  name: 'EB Motors',
  address: '123 Dealer Way, Sandton, Johannesburg',
  phone: '+27 10 123 4567',
  email: 'sales@ebmotors.co.za',
  regNumber: '2026/123456/07',
  vatNumber: '4012345678'
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

export const generateOTP = (lead: Lead, vehicles: Vehicle[]) => {
  const doc = new jsPDF() as JsPDFWithAutoTable;
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('OFFER TO PURCHASE', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: ${format(new Date(), 'PPP')}`, 105, 28, { align: 'center' });
  const otpRef = `OTP-${lead.id.substring(0, 8).toUpperCase()}`;
  doc.text(`Ref: ${otpRef}`, 105, 33, { align: 'center' });

  // Company Info (Left)
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(COMPANY_INFO.name, 14, 45);
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(COMPANY_INFO.address, 14, 50);
  doc.text(`Tel: ${COMPANY_INFO.phone}`, 14, 55);
  doc.text(`Email: ${COMPANY_INFO.email}`, 14, 60);

  // Customer Info (Right)
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Purchaser Details:', 120, 45);
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`Name: ${lead.customerName}`, 120, 50);
  doc.text(`Phone: ${lead.phone}`, 120, 55);
  doc.text(`Email: ${lead.email}`, 120, 60);

  // Line
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 65, 196, 65);

  // Vehicles Table
  const vehicleRows = vehicles.map(v => [
    `${v.year} ${v.make} ${v.model} ${v.variant || ''}`,
    v.vin || 'N/A',
    v.color,
    `${v.mileage.toLocaleString()} km`,
    formatCurrency(v.price)
  ]);

  autoTable(doc, {
    startY: 70,
    head: [['Vehicle Description', 'VIN', 'Color', 'Mileage', 'Price']],
    body: vehicleRows,
    theme: 'striped',
    headStyles: { fillColor: [0, 0, 0] },
    styles: { fontSize: 9 }
  });

  // Financials
  const finalY = doc.lastAutoTable.finalY + 10;
  
  const totalPrice = vehicles.reduce((sum, v) => sum + v.price, 0);
  const discount = lead.saleDetails?.discountAmount || 0;
  const totalDue = totalPrice - discount;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('Financial Details:', 14, finalY);

  autoTable(doc, {
    startY: finalY + 5,
    body: [
      ['Vehicle Selling Price (Incl. VAT)', formatCurrency(totalPrice)],
      ['Less: Discount', `-${formatCurrency(discount)}`],
      ['On The Road Fees', formatCurrency(5500)],
      ['Total Purchase Price', formatCurrency(totalDue + 5500)]
    ],
    theme: 'plain',
    columnStyles: {
      0: { cellWidth: 140 },
      1: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
    }
  });

  // Terms & Signatures
  const termsY = doc.lastAutoTable.finalY + 20;
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Terms and Conditions:', 14, termsY);
  doc.text('1. This offer is valid for 7 days.', 14, termsY + 5);
  doc.text('2. Vehicle remains property of the dealership until paid in full.', 14, termsY + 10);
  doc.text('3. Sold as is, without warranty unless specified otherwise.', 14, termsY + 15);

  // Signature Lines
  const sigY = termsY + 40;
  
  doc.line(14, sigY, 80, sigY);
  doc.text('Purchaser Signature', 14, sigY + 5);

  doc.line(120, sigY, 186, sigY);
  doc.text('Dealer Principal Signature', 120, sigY + 5);

  doc.save(`${lead.customerName.replace(/\s+/g, '_')}_${otpRef}.pdf`);
};

export const generateInvoice = (lead: Lead, vehicles: Vehicle[]) => {
  const doc = new jsPDF() as JsPDFWithAutoTable;

  // Header
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text('TAX INVOICE', 14, 20);

  // Invoice Details
  doc.setFontSize(10);
  const invoiceNum = `INV-${Math.floor(Math.random() * 10000)}`;
  doc.text(`Invoice No: ${invoiceNum}`, 140, 20);
  doc.text(`Date: ${format(new Date(), 'PPP')}`, 140, 25);
  doc.text(`VAT No: ${COMPANY_INFO.vatNumber}`, 140, 30);
  
  if (lead.saleDetails?.paymentType) {
    doc.text(`Payment: ${lead.saleDetails.paymentType.toUpperCase()}`, 140, 35);
  }

  // From
  doc.setFontSize(10);
  doc.text('From:', 14, 40);
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(COMPANY_INFO.name, 14, 45);
  doc.text(COMPANY_INFO.address, 14, 50);
  doc.text(COMPANY_INFO.regNumber, 14, 55);

  // To
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Bill To:', 140, 40);
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(lead.customerName, 140, 45);
  doc.text(lead.email, 140, 50);
  doc.text(lead.phone, 140, 55);

  // Vehicles Table
  const vehicleRows = vehicles.map(v => [
    `${v.year} ${v.make} ${v.model} ${v.variant || ''}\nVIN: ${v.vin || 'N/A'}`,
    '1',
    formatCurrency(v.price),
    formatCurrency(v.price)
  ]);

  autoTable(doc, {
    startY: 70,
    head: [['Description', 'Qty', 'Unit Price', 'Total']],
    body: vehicleRows,
    theme: 'grid',
    headStyles: { fillColor: [40, 40, 40] },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  const totalPrice = vehicles.reduce((sum, v) => sum + v.price, 0);
  const discount = lead.saleDetails?.discountAmount || 0;
  const subtotal = totalPrice - discount;
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const totalsBody = [
    ['Subtotal', formatCurrency(totalPrice)],
  ];

  if (discount > 0) {
    totalsBody.push(['Less: Discount', `-${formatCurrency(discount)}`]);
  }

  totalsBody.push(
    ['Net Amount', formatCurrency(subtotal)],
    ['VAT (15%)', formatCurrency(vat)],
    ['TOTAL', formatCurrency(total)]
  );

  autoTable(doc, {
    startY: finalY,
    body: totalsBody,
    theme: 'plain',
    showHead: 'never',
    columnStyles: {
      0: { cellWidth: 140, halign: 'right' },
      1: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
    }
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for your business!', 105, pageHeight - 20, { align: 'center' });
  doc.text('Bank Details: Standard Bank | Acc: 123456789 | Branch: 051001', 105, pageHeight - 15, { align: 'center' });

  doc.save(`${lead.customerName.replace(/\s+/g, '_')}_${invoiceNum}.pdf`);
};
