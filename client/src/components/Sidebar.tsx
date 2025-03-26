import { Link } from "wouter";
import { ClipboardList, Home, LayoutGrid, Database, Code, Terminal } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 pt-5 pb-4 flex-shrink-0 h-screen">
      <div className="px-6">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <h1 className="ml-2 text-xl font-semibold text-gray-800">Task API</h1>
        </div>
      </div>
      
      <div className="mt-6 px-3">
        <nav className="space-y-1">
          <Link href="/">
            <a className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              <Home className="mr-3 h-5 w-5 text-gray-500" />
              Home
            </a>
          </Link>
          
          <Link href="#overview">
            <a 
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeSection === "overview" 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
              onClick={() => setActiveSection("overview")}
            >
              <LayoutGrid className="mr-3 h-5 w-5 text-gray-500" />
              Overview
            </a>
          </Link>
          
          <Link href="#endpoints">
            <a 
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeSection === "endpoints" 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
              onClick={() => setActiveSection("endpoints")}
            >
              <Terminal className="mr-3 h-5 w-5 text-gray-500" />
              API Endpoints
            </a>
          </Link>
          
          <Link href="#schema">
            <a 
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeSection === "schema" 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
              onClick={() => setActiveSection("schema")}
            >
              <Database className="mr-3 h-5 w-5 text-gray-500" />
              Database Schema
            </a>
          </Link>
          
          <Link href="#testing">
            <a 
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeSection === "testing" 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
              onClick={() => setActiveSection("testing")}
            >
              <Terminal className="mr-3 h-5 w-5 text-gray-500" />
              API Testing
            </a>
          </Link>
          
          <Link href="#implementation">
            <a 
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeSection === "implementation" 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
              onClick={() => setActiveSection("implementation")}
            >
              <Code className="mr-3 h-5 w-5 text-gray-500" />
              Implementation
            </a>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
