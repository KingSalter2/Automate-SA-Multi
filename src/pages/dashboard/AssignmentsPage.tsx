
import { useState } from "react";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  User,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Task, TaskType, Priority, TaskStatus } from "@/types/task";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockTasks } from "@/data/mockTasks";
import { mockSalespeople } from "@/data/mockLeads";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";

export default function AssignmentsPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form State
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    type: "general",
    dueDate: new Date()
  });

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo) {
      toast({
        title: "Missing Fields",
        description: "Please fill in at least the title and assignee.",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title!,
      description: newTask.description || "",
      assignedTo: newTask.assignedTo!,
      assignedBy: "Rameez Admin",
      priority: (newTask.priority as Priority) || "medium",
      status: "pending",
      dueDate: newTask.dueDate || new Date(),
      type: (newTask.type as TaskType) || "general",
      createdAt: new Date()
    };

    setTasks([...tasks, task]);
    setIsDialogOpen(false);
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      type: "general",
      dueDate: new Date()
    });

    toast({
      title: "Task Assigned",
      description: `Task assigned to ${task.assignedTo}`,
    });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      case 'medium': return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
      case 'low': return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'lead': return <User className="w-3 h-3 mr-1" />;
      case 'vehicle_prep': return <Briefcase className="w-3 h-3 mr-1" />;
      case 'admin': return <CheckCircle2 className="w-3 h-3 mr-1" />;
      default: return <CheckCircle2 className="w-3 h-3 mr-1" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return "text-green-500";
      case 'in-progress': return "text-blue-500";
      case 'rejected': return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">Manage and distribute tasks to your team.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Assign Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>
                Assign a new task to a team member.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Call pending leads" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Provide more details..." 
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Assign To</Label>
                  <Select 
                    value={newTask.assignedTo} 
                    onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSalespeople.map(person => (
                        <SelectItem key={person.id} value={person.name}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select 
                    value={newTask.type} 
                    onValueChange={(value: TaskType) => setNewTask({...newTask, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="lead">Lead Follow-up</SelectItem>
                      <SelectItem value="vehicle_prep">Vehicle Prep</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value: Priority) => setNewTask({...newTask, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newTask.dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTask.dueDate ? format(newTask.dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newTask.dueDate}
                        onSelect={(date) => setNewTask({...newTask, dueDate: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTask}>Assign Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-auto pb-4">
        {mockSalespeople.map((person) => {
          const staffTasks = tasks.filter(t => t.assignedTo === person.name);
          
          return (
            <Card key={person.id} className="flex flex-col h-full bg-muted/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{person.name}</CardTitle>
                      <CardDescription>{staffTasks.length} Active Tasks</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto space-y-3 p-3 pt-0">
                {staffTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm border-2 border-dashed border-muted rounded-lg">
                    <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                    <p>No active assignments</p>
                  </div>
                ) : (
                  staffTasks.map(task => (
                    <Card key={task.id} className="bg-background shadow-sm hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: task.priority === 'high' ? 'ef4444' : task.priority === 'medium' ? 'f97316' : '3b82f6' }}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5", getPriorityColor(task.priority))}>
                            {task.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                            {getTypeIcon(task.type)}
                            {task.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {task.description}
                        </p>
                        {task.status === 'rejected' && task.rejectionReason && (
                          <div className="mt-2 p-2 bg-destructive/5 rounded border border-destructive/20">
                            <p className="text-[10px] font-semibold text-destructive mb-0.5">Rejected Reason:</p>
                            <p className="text-[10px] text-destructive/80 italic">{task.rejectionReason}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {format(task.dueDate, "MMM d")}
                          </div>
                          <div className={cn("flex items-center font-medium", getStatusColor(task.status))}>
                            {task.status === 'completed' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : 
                             task.status === 'rejected' ? <AlertCircle className="w-3 h-3 mr-1" /> :
                             <Clock className="w-3 h-3 mr-1" />}
                            {task.status.replace('-', ' ')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <Button variant="ghost" className="w-full text-xs h-8" onClick={() => {
                  setNewTask({...newTask, assignedTo: person.name});
                  setIsDialogOpen(true);
                }}>
                  <Plus className="w-3 h-3 mr-1" /> Add Task
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
