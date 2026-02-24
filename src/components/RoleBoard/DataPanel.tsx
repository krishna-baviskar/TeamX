"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Edit2, Upload, RotateCcw } from "lucide-react";
import { TeamMember } from "@/types/dashboard";

interface DataPanelProps {
  members: TeamMember[];
  onUpdateMembers: (members: TeamMember[]) => void;
  onReset: () => void;
}

export function DataPanel({ members, onUpdateMembers, onReset }: DataPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    title: "",
    metrics: { velocity: 50, quality: 50, comms: 50, initiative: 50, delivery: 50 }
  });

  const handleAddMember = () => {
    if (!newMember.name) return;
    const member: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMember.name || "New Member",
      title: newMember.title || "Developer",
      metrics: newMember.metrics as any,
      trend: [{ week: "W1", value: 50 }]
    };
    onUpdateMembers([...members, member]);
    setNewMember({ name: "", title: "", metrics: { velocity: 50, quality: 50, comms: 50, initiative: 50, delivery: 50 } });
  };

  const handleDeleteMember = (id: string) => {
    onUpdateMembers(members.filter(m => m.id !== id));
  };

  const handleCsvImport = () => {
    const paste = prompt("Paste CSV data (Name, Title, Velocity, Quality, Comms)");
    if (!paste) return;
    
    const rows = paste.split('\n');
    const newOnes = rows.map(row => {
      const [name, title, v, q, c] = row.split(',');
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        title: title.trim(),
        metrics: { 
          velocity: parseInt(v) || 50, 
          quality: parseInt(q) || 50, 
          comms: parseInt(c) || 50, 
          initiative: 50, 
          delivery: 50 
        },
        trend: [{ week: "W1", value: 50 }]
      };
    });
    onUpdateMembers([...members, ...newOnes]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-headline">Team Data Management</h2>
          <p className="text-muted-foreground">Manage your squad's performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCsvImport}>
            <Upload className="w-4 h-4 mr-2" />
            CSV Paste
          </Button>
          <Button variant="outline" size="sm" onClick={onReset} className="text-destructive hover:bg-destructive/10">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Demo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Members List</CardTitle>
            <CardDescription>All team members currently tracked</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Metrics (Avg)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map(member => {
                  const avg = Object.values(member.metrics).reduce((a, b) => a + b, 0) / 5;
                  return (
                    <TableRow key={member.id} className="font-code text-sm">
                      <TableCell className="font-bold">{member.name}</TableCell>
                      <TableCell>{member.title}</TableCell>
                      <TableCell>
                        <span className={avg > 80 ? "text-green-500" : avg < 60 ? "text-red-500" : ""}>
                          {avg.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteMember(member.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="glass-card h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Add Member</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                placeholder="Jane Doe" 
                value={newMember.name} 
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input 
                placeholder="Engineer" 
                value={newMember.title} 
                onChange={(e) => setNewMember({...newMember, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {['velocity', 'quality', 'comms', 'initiative', 'delivery'].map(m => (
                <div key={m} className="space-y-1">
                  <Label className="text-[10px] uppercase">{m}</Label>
                  <Input 
                    type="number" 
                    className="h-8 text-xs font-code"
                    value={newMember.metrics?.[m as keyof typeof newMember.metrics]} 
                    onChange={(e) => setNewMember({
                      ...newMember, 
                      metrics: { ...newMember.metrics, [m]: parseInt(e.target.value) } as any
                    })}
                  />
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" onClick={handleAddMember}>
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
