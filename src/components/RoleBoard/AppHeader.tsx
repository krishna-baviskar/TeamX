"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, LayoutDashboard, Database, Settings as SettingsIcon, Bell } from "lucide-react";
import { Role } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  role: Role;
  name?: string;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
}

export function AppHeader({ role, name, onLogout, activeTab, setActiveTab, title }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-headline font-bold text-white text-lg">R</div>
          <span className="font-headline font-bold text-xl tracking-tight hidden sm:inline-block">{title}</span>
        </div>

        {role === 'admin' && (
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'data', label: 'Team Data', icon: Database },
              { id: 'settings', label: 'Settings', icon: SettingsIcon },
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2",
                  activeTab === tab.id ? "bg-primary/10 text-primary hover:bg-primary/20" : ""
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-2">
          <span className="text-xs text-muted-foreground">Logged in as</span>
          <span className="text-sm font-bold font-code">{role === 'admin' ? 'Administrator' : name}</span>
        </div>

        <Badge className={cn(
          "px-3 py-1 font-headline tracking-widest text-[10px] uppercase shadow-[0_0_15px_rgba(0,0,0,0.1)]",
          role === 'admin' ? "bg-red-500 text-white animate-pulse" : "bg-green-500 text-white shadow-green-500/20"
        )}>
          {role}
        </Badge>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </Button>

        <Button variant="outline" size="sm" onClick={onLogout} className="border-border/50 hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
