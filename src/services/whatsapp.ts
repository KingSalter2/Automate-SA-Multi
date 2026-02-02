
import { Lead } from "@/types/vehicle";
import { mockVehicles } from "@/data/mockVehicles";

// Backend integration required
export const sendWelcomeMessage = async (lead: Lead): Promise<boolean> => {
  // TODO: Replace with actual API call to backend
  // await fetch('/api/send-whatsapp', { method: 'POST', body: JSON.stringify(lead) });
  
  await new Promise(resolve => setTimeout(resolve, 1500));

  const vehicleName = lead.vehicleIds && lead.vehicleIds.length > 0 
    ? mockVehicles.find(v => v.id === lead.vehicleIds![0])?.model 
    : "Vehicle";

  const message = `
    *Enquiry Received - EB Motors*
    
    Hi ${lead.customerName},
    
    Thank you for your interest in the *${vehicleName}* at *EB Motors*.
    
    We have successfully received your enquiry. One of our sales executives will review your request and contact you shortly to assist further.
    
    _(Please disregard this message if you did not make an enquiry with us.)_
    
    Best regards,
    *The EB Motors Team*
  `;

  return true;
};
