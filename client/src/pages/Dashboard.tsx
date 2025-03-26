import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ClipboardList, Menu, Plus, Edit, Trash, Check, X, Calendar, Clock, RefreshCw, 
  Search, Filter, ArrowDownAZ, ArrowUpZA, Loader2, LogOut
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Task } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  // Fetch tasks
  const { data: tasks = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['/api/tasks'],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/tasks");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch tasks");
      }
      return res.json();
    }
  });

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: async (newTask: { title: string; description: string; status: string }) => {
      const res = await apiRequest("POST", "/api/tasks", newTask);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create task");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      setIsCreateModalOpen(false);
      resetForm();
      toast({
        title: "Task created",
        description: "The task has been created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create task",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, task }: { id: number; task: { title?: string; description?: string; status?: string } }) => {
      const res = await apiRequest("PUT", `/api/tasks/${id}`, task);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update task");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      setIsEditModalOpen(false);
      resetForm();
      toast({
        title: "Task updated",
        description: "The task has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/tasks/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete task");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      setIsDeleteModalOpen(false);
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete task",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle creating a task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ title, description, status });
  };

  // Handle updating a task
  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    const updatedTask: { title?: string; description?: string; status?: string } = {};
    if (title) updatedTask.title = title;
    if (description) updatedTask.description = description;
    if (status) updatedTask.status = status;

    updateMutation.mutate({ id: selectedTask.id, task: updatedTask });
  };

  // Handle deleting a task
  const handleDeleteTask = () => {
    if (!selectedTask) return;
    deleteMutation.mutate(selectedTask.id);
  };

  // Open edit modal with task data
  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status || "pending");
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setSelectedTask(null);
  };

  // Filter tasks based on selected tab and search query
  const filteredTasks = tasks.filter((task: Task) => {
    const matchesStatus = selectedTab === "all" || task.status === selectedTab;
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a: Task, b: Task) => {
    if (sortOrder === "asc") {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  // Task count by status
  const taskCounts = tasks.reduce((acc: { [key: string]: number }, task: Task) => {
    const status = task.status || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, { all: tasks.length });

  // Status badge colors
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "in-progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center mr-3">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Task Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/docs">
              <Button variant="outline" size="sm">API Docs</Button>
            </Link>
            <Button 
              onClick={() => setIsCreateModalOpen(true)} 
              size="sm"
              className="hidden sm:flex"
            >
              <Plus className="mr-1 h-4 w-4" /> New Task
            </Button>
            <Button 
              onClick={() => setIsCreateModalOpen(true)} 
              variant="default" 
              size="icon" 
              className="sm:hidden"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto container mx-auto px-4 py-6">
        {/* Task Filters and Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search tasks..."
                className="pl-8 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <Tabs 
              defaultValue="all" 
              className="w-full"
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">
                  All
                  {taskCounts.all > 0 && (
                    <Badge className="ml-1 bg-gray-200 text-gray-800 hover:bg-gray-200">
                      {taskCounts.all}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending
                  {taskCounts.pending > 0 && (
                    <Badge className="ml-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      {taskCounts.pending}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="in-progress">
                  In Progress
                  {taskCounts['in-progress'] > 0 && (
                    <Badge className="ml-1 bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {taskCounts['in-progress']}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed
                  {taskCounts.completed > 0 && (
                    <Badge className="ml-1 bg-green-100 text-green-800 hover:bg-green-100">
                      {taskCounts.completed}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title={sortOrder === "asc" ? "Sort Z to A" : "Sort A to Z"}
            >
              {sortOrder === "asc" ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpZA className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              title="Refresh tasks"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-500">Loading tasks...</span>
            </div>
          ) : isError ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-800 mb-2">Error loading tasks</h3>
                <p className="text-red-600">{error instanceof Error ? error.message : "Unknown error occurred"}</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => refetch()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
              </CardContent>
            </Card>
          ) : sortedTasks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No tasks found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery
                    ? `No tasks matching "${searchQuery}"`
                    : selectedTab !== "all"
                    ? `No ${selectedTab} tasks found`
                    : "Create your first task to get started"}
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create new task
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTasks.map((task: Task) => (
                <Card key={task.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Badge
                      className={`self-start mb-2 ${getStatusBadgeColor(task.status || "pending")}`}
                    >
                      {task.status || "pending"}
                    </Badge>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {task.description || "No description provided"}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditModal(task)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={() => openDeleteModal(task)}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Task Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your task list
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTask}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Task Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the details of your task
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTask}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Task Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              variant="destructive"
              onClick={handleDeleteTask}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
