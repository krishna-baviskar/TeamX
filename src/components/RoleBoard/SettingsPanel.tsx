
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; 
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AppSettings } from "@/types/dashboard";
import { Moon, Sun, Palette, Shield, Download, Lock } from "lucide-react";

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onExport: () => void;
}

export function SettingsPanel({ settings, onUpdateSettings, onExport }: SettingsPanelProps) {
  const accentPresets = ["#f97316", "#8b5cf6", "#3b82f6", "#10b981", "#ef4444"];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-headline">System Settings</h2>
          <p className="text-muted-foreground">Configure global application behavior and appearance</p>
        </div>
        <Button onClick={onExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data (JSON)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Control theme and accents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex flex-col gap-1">
                <span>Dark Mode</span>
                <span className="text-xs font-normal text-muted-foreground">Toggle between light and dark themes</span>
              </Label>
              <Switch 
                id="dark-mode" 
                checked={settings.theme === "dark"} 
                onCheckedChange={(checked) => onUpdateSettings({ ...settings, theme: checked ? "dark" : "light" })}
              />
            </div>
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Accent Color
              </Label>
              <div className="flex gap-2">
                {accentPresets.map(color => (
                  <button
                    key={color}
                    onClick={() => onUpdateSettings({ ...settings, accent: color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${settings.accent === color ? 'border-foreground scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Security & Identity</CardTitle>
            </div>
            <CardDescription>System access and visibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Admin Password
              </Label>
              <Input 
                type="text"
                placeholder="New admin password"
                value={settings.adminPassword} 
                onChange={(e) => onUpdateSettings({ ...settings, adminPassword: e.target.value })}
              />
              <p className="text-[10px] text-muted-foreground">This password will be required for Admin Portal access next login.</p>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <Label htmlFor="show-names" className="flex flex-col gap-1">
                <span>Show Real Names</span>
                <span className="text-xs font-normal text-muted-foreground">Allow viewers to see teammate identities</span>
              </Label>
              <Switch 
                id="show-names" 
                checked={settings.showMemberNamesInViewerCharts} 
                onCheckedChange={(checked) => onUpdateSettings({ ...settings, showMemberNamesInViewerCharts: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label>Dashboard Title</Label>
              <Input 
                value={settings.dashboardTitle} 
                onChange={(e) => onUpdateSettings({ ...settings, dashboardTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Team Identity</Label>
              <Input 
                value={settings.teamName} 
                onChange={(e) => onUpdateSettings({ ...settings, teamName: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
