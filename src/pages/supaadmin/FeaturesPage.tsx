
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Sparkles, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { mockFeatures, Feature } from "@/data/mockSupaAdmin";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const FeaturesPage = () => {
  const [features, setFeatures] = useState<Feature[]>(mockFeatures);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFeature, setNewFeature] = useState({
    name: "",
    description: "",
    isPremium: false
  });

  const handleToggleFeature = (id: string, currentState: boolean) => {
    setFeatures(features.map(f => 
      f.id === id ? { ...f, isEnabled: !currentState } : f
    ));
    toast.success(`Feature ${!currentState ? 'enabled' : 'disabled'} successfully`);
  };

  const handleDeleteFeature = (id: string) => {
    setFeatures(features.filter(f => f.id !== id));
    toast.success("Feature deleted successfully");
  };

  const handleCreateFeature = () => {
    if (!newFeature.name || !newFeature.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const feature: Feature = {
      id: `f${features.length + 1}`,
      name: newFeature.name,
      description: newFeature.description,
      isEnabled: true,
      isPremium: newFeature.isPremium
    };

    setFeatures([...features, feature]);
    toast.success("Feature created successfully");
    setIsDialogOpen(false);
    setNewFeature({ name: "", description: "", isPremium: false });
  };

  const filteredFeatures = features.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Feature Control</h1>
          <p className="text-muted-foreground">Manage system-wide features and availability.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Create New Feature
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-card p-2 rounded-lg border border-border w-full sm:w-96">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search features..." 
          className="bg-transparent border-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground h-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[300px]">Feature Name</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeatures.map((feature) => (
              <TableRow key={feature.id} className="border-border hover:bg-muted/30">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{feature.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{feature.id}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground max-w-[400px] truncate">
                  {feature.description}
                </TableCell>
                <TableCell>
                  {feature.isPremium ? (
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  ) : (
                    <Badge variant="outline">Standard</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={feature.isEnabled}
                      onCheckedChange={() => handleToggleFeature(feature.id, feature.isEnabled)}
                    />
                    <span className={`text-sm ${feature.isEnabled ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {feature.isEnabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => toast.info("Edit functionality coming soon")}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteFeature(feature.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Feature
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Create New Feature</DialogTitle>
            <DialogDescription>
              Define a new feature flag for the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Feature Name</Label>
              <Input 
                id="name" 
                value={newFeature.name}
                onChange={(e) => setNewFeature({...newFeature, name: e.target.value})}
                placeholder="e.g. Dark Mode"
                className="bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea 
                id="desc" 
                value={newFeature.description}
                onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
                placeholder="Brief description of what this feature does..."
                className="bg-background"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="premium" 
                checked={newFeature.isPremium}
                onCheckedChange={(checked) => setNewFeature({...newFeature, isPremium: checked})}
              />
              <Label htmlFor="premium">Premium Feature</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFeature}>Create Feature</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeaturesPage;
