"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, ShieldCheck, ChevronRight, AlertCircle } from "lucide-react";
import { Role } from "@/types/dashboard";

interface LoginProps {
  onLogin: (role: Role, viewerName?: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [password, setPassword] = useState("");
  const [viewerName, setViewerName] = useState("");
  const [error, setError] = useState("");

  const handleAdminLogin = () => {
    if (password === "admin123") {
      onLogin("admin");
    } else {
      setError("Incorrect password (Hint: admin123)");
    }
  };

  const handleViewerLogin = () => {
    if (viewerName.trim()) {
      onLogin("viewer", viewerName);
    } else {
      setError("Please enter your name");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[url('https://picsum.photos/seed/bg/1920/1080')] bg-cover bg-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center space-y-4 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <h1 className="text-5xl font-headline font-extrabold tracking-tighter">ROLEBOARD</h1>
          </div>
          <p className="text-xl text-muted-foreground font-body max-w-md">
            The next-generation team performance intelligence engine. Choose your access level to begin.
          </p>
        </div>

        <div className="space-y-6">
          {!selectedRole ? (
            <div className="grid grid-cols-1 gap-4">
              <Card 
                className="glass-card hover:scale-[1.02] transition-all cursor-pointer group"
                onClick={() => setSelectedRole('admin')}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="font-headline">Admin Portal</CardTitle>
                    <CardDescription>Full data management and analytics control</CardDescription>
                  </div>
                  <ChevronRight className="ml-auto w-5 h-5 text-muted-foreground" />
                </CardHeader>
              </Card>

              <Card 
                className="glass-card hover:scale-[1.02] transition-all cursor-pointer group"
                onClick={() => setSelectedRole('viewer')}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="font-headline">Team Viewer</CardTitle>
                    <CardDescription>View your personal stats and team progress</CardDescription>
                  </div>
                  <ChevronRight className="ml-auto w-5 h-5 text-muted-foreground" />
                </CardHeader>
              </Card>
            </div>
          ) : (
            <Card className="glass-card accent-line-top animate-in slide-in-from-right-10 duration-500">
              <CardHeader>
                <CardTitle className="font-headline">
                  {selectedRole === 'admin' ? 'Admin Verification' : 'Welcome to TeamView'}
                </CardTitle>
                <CardDescription>
                  {selectedRole === 'admin' ? 'Please enter the administrative password' : 'Tell us your name to personalize your view'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedRole === 'admin' ? (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. John Doe" 
                      value={viewerName}
                      onChange={(e) => { setViewerName(e.target.value); setError(""); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleViewerLogin()}
                    />
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm font-medium bg-destructive/10 p-2 rounded border border-destructive/20">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={() => { setSelectedRole(null); setError(""); }}>Back</Button>
                <Button onClick={selectedRole === 'admin' ? handleAdminLogin : handleViewerLogin}>
                  Login <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
