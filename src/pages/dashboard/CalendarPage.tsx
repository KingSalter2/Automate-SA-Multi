import { useState, useEffect } from "react";
import type { SVGProps } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Clock,
  MapPin,
  User,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIconLucide,
} from "lucide-react";
import { mockAppointments, CalendarEvent } from "@/data/mockCalendar";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
  startOfDay,
  endOfDay,
} from "date-fns";
import { cn } from "@/lib/utils";

type EventFilter = "today" | "upcoming" | "past" | "all";

function exportEventsToCsv(events: CalendarEvent[], fileName: string) {
  const headers = ["id", "title", "customer", "date", "time", "type", "location", "assignedTo"];

  const escapeCsvValue = (value: unknown) => {
    const s = String(value ?? "");
    if (s.includes('"') || s.includes(",") || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s;
  };

  const rows = events.map((e) => [
    e.id,
    e.title,
    e.customer,
    format(new Date(e.date), "yyyy-MM-dd"),
    e.time,
    e.type,
    e.location,
    e.assignedTo ?? "",
  ]);

  const csv = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<CalendarEvent[]>(mockAppointments);
  const [eventFilter, setEventFilter] = useState<EventFilter>("today");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);
  const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);
  
  // New Appointment State
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState<{
    title: string;
    customer: string;
    date: string;
    time: string;
    type: CalendarEvent["type"];
    location: string;
    assignedTo: string;
  }>({
    title: "",
    customer: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "09:00",
    type: "test-drive",
    location: "Dealership",
    assignedTo: "Mike Sales"
  });

  // Refresh appointments when component mounts (to get latest mock data)
  useEffect(() => {
    setAppointments(mockAppointments);
  }, []);

  const effectiveDate = selectedDate;
  const dayStart = startOfDay(effectiveDate);
  const dayEnd = endOfDay(effectiveDate);

  // Generate calendar grid days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const eventsByDateKey = appointments.reduce<Record<string, CalendarEvent[]>>((acc, apt) => {
    const key = format(new Date(apt.date), "yyyy-MM-dd");
    acc[key] = acc[key] ? [...acc[key], apt] : [apt];
    return acc;
  }, {});

  const filteredAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(apt.date);
      if (eventFilter === "all") return true;
      if (eventFilter === "upcoming") return aptDate > new Date(); // upcoming relative to *now*
      if (eventFilter === "past") return aptDate < startOfDay(new Date()); // past relative to *now*
      // For "today", use the selected date from calendar or today's real date?
      // User likely wants "Today" filter to show *Today's* events, not the selected date's.
      // But if they select a date on calendar, they expect to see that date.
      // Let's make "Today" filter strictly mean "Today's Date".
      // If they click a calendar day, it opens a dialog anyway.
      const today = new Date();
      return isSameDay(aptDate, today);
    })
    .sort((a, b) => {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      if (aDate !== bDate) {
        if (eventFilter === "past") return bDate - aDate;
        return aDate - bDate;
      }
      return a.time.localeCompare(b.time);
    });

  const scheduleTitle =
    eventFilter === "today"
      ? "Today's Schedule"
      : eventFilter === "upcoming"
        ? "Upcoming Events"
        : eventFilter === "past"
          ? "Past Events"
          : "All Events";

  const openEventDetails = (event: CalendarEvent, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleExport = () => {
    const suffix = format(new Date(), "yyyy-MM-dd");
    exportEventsToCsv(filteredAppointments, `events-${eventFilter}-${suffix}.csv`);
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    const key = format(day, "yyyy-MM-dd");
    const events = (eventsByDateKey[key] ?? []).slice().sort((a, b) => a.time.localeCompare(b.time));
    
    // Always open day dialog if clicked on the grid
    setDayEvents(events);
    setIsDayDialogOpen(true);
  };

  const handleAddAppointment = () => {
    const newEvent: CalendarEvent = {
      id: Date.now(),
      title: newAppointment.title || "New Appointment",
      customer: newAppointment.customer || "Unknown Customer",
      date: new Date(`${newAppointment.date}T00:00:00`),
      time: newAppointment.time,
      type: newAppointment.type,
      location: newAppointment.location,
      assignedTo: newAppointment.assignedTo,
    };
    
    setAppointments([...appointments, newEvent]);
    setIsNewAppointmentOpen(false);
    
    // Reset form
    setNewAppointment({
      title: "",
      customer: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "09:00",
      type: "test-drive",
      location: "Dealership",
      assignedTo: "Mike Sales"
    });
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const jumpToToday = () => {
    const now = new Date();
    setCurrentMonth(now);
    setSelectedDate(now);
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">Manage appointments, test drives, and follow-ups.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsNewAppointmentOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Main Calendar Grid */}
      <Card className="overflow-hidden border-none shadow-md ring-1 ring-black/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-xl">
              {format(currentMonth, "MMMM yyyy")}
            </h3>
            <div className="flex items-center rounded-md border bg-background shadow-sm">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none rounded-l-md" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="w-[1px] h-4 bg-border" />
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none rounded-r-md" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={jumpToToday}>
              Today
            </Button>
          </div>
        </CardHeader>
        
        <div className="p-0">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b text-center text-sm font-semibold text-muted-foreground bg-muted/40">
            {weekDays.map((day) => (
              <div key={day} className="py-3">
                {day}
              </div>
            ))}
          </div>
          
          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr bg-muted/20 gap-[1px]">
            {calendarDays.map((day, dayIdx) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const events = eventsByDateKey[dateKey] ?? [];
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={day.toString()}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "min-h-[140px] bg-background p-2 transition-colors hover:bg-muted/50 cursor-pointer relative group flex flex-col gap-1",
                    !isCurrentMonth && "bg-muted/5 text-muted-foreground",
                    isSelected && "bg-accent/10"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                        isTodayDate
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground group-hover:bg-muted"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {events.length > 0 && (
                      <span className="text-[10px] font-medium text-muted-foreground hidden sm:inline-block">
                        {events.length} events
                      </span>
                    )}
                  </div>
                  
                  {/* Event Pills */}
                  <div className="flex-1 flex flex-col gap-1 mt-1 overflow-hidden">
                    {events.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => openEventDetails(event, e)}
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded truncate font-medium border shadow-sm transition-all hover:opacity-80",
                          event.type === "test-drive" 
                            ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                            : event.type === "finance"
                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                            : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                        )}
                      >
                        {event.time} {event.title}
                      </div>
                    ))}
                    {events.length > 3 && (
                      <div className="text-[10px] text-muted-foreground px-1">
                        + {events.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Filtered List Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{scheduleTitle}</CardTitle>
            <Tabs value={eventFilter} onValueChange={(v) => setEventFilter(v as EventFilter)}>
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => (
                <button
                  key={apt.id}
                  type="button"
                  className="w-full text-left flex items-start p-4 rounded-lg border bg-card hover:bg-secondary/20 transition-colors group"
                  onClick={() => openEventDetails(apt)}
                >
                  <div className="mr-4 flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Clock className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold whitespace-nowrap">{apt.time}</span>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-lg">{apt.title}</h4>
                      <Badge variant={
                        apt.type === 'test-drive' ? 'default' : 
                        apt.type === 'finance' ? 'secondary' : 'outline'
                      }>
                        {apt.type}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <CalendarIconLucide className="w-3 h-3" /> 
                        {format(new Date(apt.date), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {apt.customer}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {apt.location}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
              <CalendarIcon className="w-8 h-8 mb-2 opacity-20" />
              <p>No events found for this filter.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Day Details Dialog */}
      <Dialog open={isDayDialogOpen} onOpenChange={setIsDayDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {format(selectedDate, "EEEE, dd MMMM yyyy")}
            </DialogTitle>
            <DialogDescription>
              {dayEvents.length} events scheduled for this day.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 mt-4">
            {dayEvents.length > 0 ? (
              dayEvents.map((apt) => (
                <button
                  key={apt.id}
                  type="button"
                  className="w-full text-left flex items-start gap-4 rounded-lg border p-4 hover:bg-secondary/20 transition-colors"
                  onClick={() => {
                    setIsDayDialogOpen(false);
                    openEventDetails(apt);
                  }}
                >
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary">
                    <Clock className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold whitespace-nowrap">{apt.time}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-bold">{apt.title}</div>
                      <Badge variant={apt.type === "test-drive" ? "default" : "outline"}>
                        {apt.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3" /> {apt.customer}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {apt.location}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No events scheduled.
                <Button variant="link" className="px-2" onClick={() => setIsDayDialogOpen(false)}>
                  Create one?
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-3">
              <span>{selectedEvent?.title ?? "Event Details"}</span>
              {selectedEvent && (
                <Badge
                  variant={
                    selectedEvent.type === "test-drive"
                      ? "default"
                      : selectedEvent.type === "finance"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {selectedEvent.type}
                </Badge>
              )}
            </DialogTitle>
            {selectedEvent && (
              <DialogDescription>
                {format(new Date(selectedEvent.date), "EEEE, dd MMMM yyyy")} at {selectedEvent.time}
              </DialogDescription>
            )}
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 bg-muted/20">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Customer</div>
                  <div className="font-semibold text-lg flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    {selectedEvent.customer}
                  </div>
                </div>
                <div className="rounded-lg border p-4 bg-muted/20">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Location</div>
                  <div className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {selectedEvent.location}
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4 bg-muted/20">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Assigned To</div>
                <div className="font-semibold text-lg">{selectedEvent.assignedTo ?? "Unassigned"}</div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>Close</Button>
                <Button>Edit Event</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Appointment Dialog */}
      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Appointment</DialogTitle>
            <DialogDescription>Create a new appointment or test drive.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input 
                id="title" 
                placeholder="e.g. Test Drive - BMW 320d"
                value={newAppointment.title}
                onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time" 
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={newAppointment.type}
                  onValueChange={(val) => setNewAppointment({...newAppointment, type: val as CalendarEvent['type']})}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test-drive">Test Drive</SelectItem>
                    <SelectItem value="finance">Finance Application</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assigned">Assigned Staff</Label>
                <Select 
                  value={newAppointment.assignedTo}
                  onValueChange={(val) => setNewAppointment({...newAppointment, assignedTo: val})}
                >
                  <SelectTrigger id="assigned">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mike Sales">Mike Sales</SelectItem>
                    <SelectItem value="Sarah Receptionist">Sarah Receptionist</SelectItem>
                    <SelectItem value="Rameez Admin">Rameez Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="customer">Customer Name</Label>
              <Input 
                id="customer" 
                placeholder="e.g. John Doe"
                value={newAppointment.customer}
                onChange={(e) => setNewAppointment({...newAppointment, customer: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="e.g. Dealership or Client Address"
                value={newAppointment.location}
                onChange={(e) => setNewAppointment({...newAppointment, location: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAppointment}>Create Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

export default CalendarPage;
