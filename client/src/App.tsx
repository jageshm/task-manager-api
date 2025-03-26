import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import ApiDocs from "@/pages/ApiDocs";
import { Auth } from './components/Auth'; // Added import for Auth component

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/home" component={Home} />
      <Route path="/docs" component={ApiDocs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Auth />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;