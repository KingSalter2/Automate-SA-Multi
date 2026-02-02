import { Task } from "@/types/task";

export const mockTasks: Task[] = [
  {
    id: "t1",
    title: "Follow up with John Smith",
    description: "He was interested in the BMW 3 Series. Call him regarding finance options.",
    assignedTo: "Mike Sales",
    assignedBy: "Rameez Admin",
    priority: "high",
    status: "pending",
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    type: "lead",
    createdAt: new Date()
  },
  {
    id: "t2",
    title: "Prepare VW Golf for Delivery",
    description: "Wash and clean the car. Ensure all papers are ready.",
    assignedTo: "Sarah Dealer",
    assignedBy: "Rameez Admin",
    priority: "medium",
    status: "in-progress",
    dueDate: new Date(Date.now() + 172800000), // 2 days
    type: "vehicle_prep",
    createdAt: new Date()
  },
  {
    id: "t3",
    title: "Update Website Inventory",
    description: "Add the new Ford Ranger photos to the website.",
    assignedTo: "Rameez Admin",
    assignedBy: "Rameez Admin",
    priority: "low",
    status: "completed",
    dueDate: new Date(Date.now() - 86400000), // Yesterday
    type: "admin",
    createdAt: new Date()
  },
  {
    id: "t4",
    title: "Call new leads from Facebook",
    description: "We received 5 new leads over the weekend.",
    assignedTo: "Mike Sales",
    assignedBy: "Rameez Admin",
    priority: "high",
    status: "rejected",
    rejectionReason: "I am already overloaded with walk-in customers today.",
    dueDate: new Date(Date.now()),
    type: "lead",
    createdAt: new Date(Date.now() - 3600000)
  }
];
