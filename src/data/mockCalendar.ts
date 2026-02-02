
export interface CalendarEvent {
  id: number;
  title: string;
  customer: string;
  time: string;
  date: Date;
  type: 'test-drive' | 'finance' | 'delivery' | 'meeting' | 'other';
  location: string;
  assignedTo?: string;
}

export const mockAppointments: CalendarEvent[] = [
  {
    id: 1,
    title: "Test Drive - BMW 3 Series",
    customer: "John Smith",
    time: "09:00 AM",
    date: new Date(),
    type: "test-drive",
    location: "Showroom"
  },
  {
    id: 2,
    title: "Finance Application Sign-off",
    customer: "Michael Brown",
    time: "11:30 AM",
    date: new Date(),
    type: "finance",
    location: "Office 2"
  },
  {
    id: 3,
    title: "Vehicle Delivery",
    customer: "Emily Davis",
    time: "02:00 PM",
    date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    type: "delivery",
    location: "Delivery Bay"
  }
];

export const addAppointment = (appointment: Omit<CalendarEvent, 'id'>) => {
  const newId = Math.max(...mockAppointments.map(a => a.id), 0) + 1;
  mockAppointments.push({ ...appointment, id: newId });
};
