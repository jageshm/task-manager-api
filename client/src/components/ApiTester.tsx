import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ApiTester() {
  const { toast } = useToast();
  const [selectedEndpoint, setSelectedEndpoint] = useState("create");
  const [taskId, setTaskId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [response, setResponse] = useState("// Response will appear here");
  const [isLoading, setIsLoading] = useState(false);

  const handleEndpointChange = (value: string) => {
    setSelectedEndpoint(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let method = "";
    let url = "";
    let body: any = undefined;

    switch (selectedEndpoint) {
      case "create":
        method = "POST";
        url = "/api/tasks";
        body = { title, description, status };
        break;
      case "get":
        method = "GET";
        url = "/api/tasks";
        break;
      case "update":
        method = "PUT";
        url = `/api/tasks/${taskId}`;
        body = {};
        if (title) body.title = title;
        if (description) body.description = description;
        if (status) body.status = status;
        break;
      case "delete":
        method = "DELETE";
        url = `/api/tasks/${taskId}`;
        break;
    }

    try {
      // Display request information
      let requestInfo = `// Request: ${method} ${url}\n`;
      if (body) {
        requestInfo += `// Body: ${JSON.stringify(body, null, 2)}\n\n`;
      }
      
      setResponse(requestInfo + "// Sending request...");

      const res = await apiRequest(method, url, body);
      const data = await res.json();

      setResponse(requestInfo + `// Response Status: ${res.status} ${res.statusText}\n\n${JSON.stringify(data, null, 2)}`);
      
      toast({
        title: "Request successful",
        description: `${method} request to ${url} completed successfully`,
      });
    } catch (error: any) {
      setResponse(`// Error: ${error.message}`);
      
      toast({
        title: "Request failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Form */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Test API Endpoints</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="endpoint">Endpoint</Label>
              <Select 
                value={selectedEndpoint} 
                onValueChange={handleEndpointChange}
              >
                <SelectTrigger id="endpoint" className="w-full">
                  <SelectValue placeholder="Select an endpoint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create">POST /api/tasks (Create)</SelectItem>
                  <SelectItem value="get">GET /api/tasks (List All)</SelectItem>
                  <SelectItem value="update">PUT /api/tasks/:id (Update)</SelectItem>
                  <SelectItem value="delete">DELETE /api/tasks/:id (Delete)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(selectedEndpoint === "update" || selectedEndpoint === "delete") && (
              <div>
                <Label htmlFor="task-id">Task ID</Label>
                <Input 
                  type="number" 
                  id="task-id" 
                  placeholder="Enter task ID" 
                  value={taskId}
                  onChange={(e) => setTaskId(e.target.value)}
                  required
                />
              </div>
            )}

            {(selectedEndpoint === "create" || selectedEndpoint === "update") && (
              <div className="space-y-2">
                <div>
                  <Label htmlFor="title" className="text-xs text-gray-500">Title</Label>
                  <Input 
                    type="text" 
                    id="title" 
                    placeholder="Task title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required={selectedEndpoint === "create"}
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-xs text-gray-500">Description</Label>
                  <Textarea 
                    id="description" 
                    rows={2} 
                    placeholder="Task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-xs text-gray-500">Status</Label>
                  <Select 
                    value={status} 
                    onValueChange={setStatus}
                  >
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">pending</SelectItem>
                      <SelectItem value="in-progress">in-progress</SelectItem>
                      <SelectItem value="completed">completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </form>
        </div>

        {/* Response Display */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Response</h3>
          <div className="bg-gray-800 rounded-md p-4 h-96 overflow-y-auto">
            <pre className="text-green-400 text-sm font-mono">{response}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
