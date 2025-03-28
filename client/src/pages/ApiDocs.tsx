import { useState } from "react";
import EndpointCard from "../components/EndpointCard";
import DatabaseSchema from "../components/DatabaseSchema";
import Implementation from "../components/Implementation";
import ApiTester from "../components/ApiTester";
import { Link } from "wouter";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ApiDocs() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center mr-3">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">API Documentation</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to Tasks
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeSection === "overview" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveSection("overview")}
            >
              Overview
            </Button>
            <Button 
              variant={activeSection === "endpoints" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveSection("endpoints")}
            >
              API Endpoints
            </Button>
            <Button 
              variant={activeSection === "schema" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveSection("schema")}
            >
              Database Schema
            </Button>
            <Button 
              variant={activeSection === "testing" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveSection("testing")}
            >
              API Testing
            </Button>
            <Button 
              variant={activeSection === "implementation" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveSection("implementation")}
            >
              Implementation
            </Button>
          </div>
        </div>

        {/* Overview section */}
        {activeSection === "overview" && (
          <section id="overview" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Management API</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <ClipboardList className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">About this API</h3>
                </div>
                <p className="mt-2 text-gray-600">
                  This is a RESTful API for managing tasks, built with Express.js and connected to a Supabase PostgreSQL database.
                  The API provides endpoints for creating, reading, updating, and deleting tasks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Tech Stack</h4>
                  </div>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-600 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Node.js
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-600 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Express.js
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-600 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Supabase PostgreSQL
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-600 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      dotenv
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Endpoints</h4>
                  </div>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li className="flex items-start">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-1.5">POST</span>
                      /api/tasks
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1.5">GET</span>
                      /api/tasks
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mr-1.5">PUT</span>
                      /api/tasks/:id
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mr-1.5">DELETE</span>
                      /api/tasks/:id
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900">Database</h4>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="mb-1">Supabase PostgreSQL with the following table:</p>
                    <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto">
tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending'
)
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* API Endpoints section */}
        {activeSection === "endpoints" && (
          <section id="endpoints" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">API Endpoints</h2>

            <EndpointCard 
              method="POST"
              path="/api/tasks"
              description="Create a new task"
              requestBody={{
                title: "Task title",  // Required
                description: "Task description",  // Optional
                status: "pending"  // Optional, default: "pending"
              }}
              responseBody={{
                id: 1,
                title: "Task title",
                description: "Task description",
                status: "pending"
              }}
              curlExample={`curl -X POST \\
  http://localhost:5000/api/tasks \\
  -H 'Content-Type: application/json' \\
  -d '{
    "title": "Complete project documentation",
    "description": "Write API documentation with examples",
    "status": "in-progress"
  }'`}
              errors={[
                { status: 400, message: "Missing required field: title" },
                { status: 500, message: "Database error" }
              ]}
            />

            <EndpointCard 
              method="GET"
              path="/api/tasks"
              description="Retrieve all tasks"
              responseBody={[
                {
                  id: 1,
                  title: "Task title 1",
                  description: "Task description 1",
                  status: "pending"
                },
                {
                  id: 2,
                  title: "Task title 2",
                  description: "Task description 2", 
                  status: "in-progress"
                }
              ]}
              curlExample="curl -X GET http://localhost:5000/api/tasks"
              errors={[
                { status: 500, message: "Database error" }
              ]}
            />

            <EndpointCard 
              method="PUT"
              path="/api/tasks/:id"
              description="Update task"
              requestBody={{
                title: "Updated task title",  // Optional
                description: "Updated description",  // Optional
                status: "completed"  // Optional
              }}
              responseBody={{
                id: 1,
                title: "Updated task title",
                description: "Updated description",
                status: "completed"
              }}
              curlExample={`curl -X PUT \\
  http://localhost:5000/api/tasks/1 \\
  -H 'Content-Type: application/json' \\
  -d '{
    "status": "completed"
  }'`}
              errors={[
                { status: 404, message: "Task not found" },
                { status: 500, message: "Database error" }
              ]}
            />

            <EndpointCard 
              method="DELETE"
              path="/api/tasks/:id"
              description="Delete a task"
              responseBody={{
                message: "Task deleted successfully"
              }}
              curlExample="curl -X DELETE http://localhost:5000/api/tasks/1"
              errors={[
                { status: 404, message: "Task not found" },
                { status: 500, message: "Database error" }
              ]}
            />
          </section>
        )}

        {/* Database Schema section */}
        {activeSection === "schema" && (
          <DatabaseSchema />
        )}

        {/* API Testing section */}
        {activeSection === "testing" && (
          <section id="testing" className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">API Testing</h2>
            <ApiTester />
          </section>
        )}

        {/* Implementation section */}
        {activeSection === "implementation" && (
          <Implementation />
        )}
      </main>
    </div>
  );
}