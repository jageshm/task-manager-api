import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ClipboardList, Database, Server } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-2 text-xl font-semibold text-gray-800">Task Management API</h1>
            </div>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Task Management API with Supabase</h2>
            <p className="text-xl text-gray-600">
              A RESTful API for managing tasks built with Express.js and PostgreSQL
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">RESTful API</h3>
                  <p className="text-gray-600">
                    Complete CRUD operations with Express.js endpoints for managing tasks
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Supabase PostgreSQL</h3>
                  <p className="text-gray-600">
                    Persistent storage with Supabase's PostgreSQL database
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <ClipboardList className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Task Management</h3>
                  <p className="text-gray-600">
                    Create, list, update, and delete tasks with status tracking
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/dashboard">
              <Button className="px-6" size="lg">
                View API Documentation
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600">
            Task Management API - Built with Express.js and Supabase
          </p>
        </div>
      </footer>
    </div>
  );
}
