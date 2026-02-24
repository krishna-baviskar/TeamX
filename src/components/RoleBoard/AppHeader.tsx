
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, LayoutDashboard, Database, Settings as SettingsIcon, Bell, Menu } from "lucide-react";
import { Role } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AppHeaderProps {
  role: Role;
  name?: string;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
}

export function AppHeader({ role, name, onLogout, activeTab, setActiveTab, title }: AppHeaderProps) {
  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'data', label: 'Team Data', icon: Database },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                  <SheetHeader className="mb-8">
                    <SheetTitle className="text-left font-headline">Navigation</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-2">
                    {adminTabs.map(tab => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "secondary" : "ghost"}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "justify-start gap-4 h-12 text-lg",
                          activeTab === tab.id ? "bg-primary/10 text-primary" : ""
                        )}
                      >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-auto pt-8 border-t absolute bottom-8 left-6 right-6">
                    <Button variant="destructive" className="w-full justify-start gap-4 h-12" onClick={onLogout}>
                      <LogOut className="w-5 h-5" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-headline font-bold text-white text-lg flex-shrink-0">R</div>
          <span className="font-headline font-bold text-lg sm:text-xl tracking-tight hidden xs:inline-block truncate max-w-[120px] sm:max-w-none">{title}</span>
        </div>

        {role === 'admin' && (
          <nav className="hidden md:flex items-center gap-1">
            {adminTabs.map(tab => (
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

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-xs text-muted-foreground">Logged in as</span>
          <span className="text-sm font-bold font-code">{role === 'admin' ? 'Administrator' : name}</span>
        </div>

        <Badge className={cn(
          "px-2 sm:px-3 py-1 font-headline tracking-widest text-[9px] sm:text-[10px] uppercase shadow-[0_0_15px_rgba(0,0,0,0.1)]",
          role === 'admin' ? "bg-red-500 text-white animate-pulse" : "bg-green-500 text-white shadow-green-500/20"
        )}>
          {role}
        </Badge>

        <Button variant="ghost" size="icon" className="relative flex-shrink-0 h-9 w-9">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </Button>

        <Button variant="outline" size="sm" onClick={onLogout} className="border-border/50 hover:bg-destructive/10 hover:text-destructive hidden sm:flex">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
