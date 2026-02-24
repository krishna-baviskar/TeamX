"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Upload, RotateCcw, Calendar, CheckSquare, ChevronRight, UserCog } from "lucide-react";
import { TeamMember, Task, ScheduleItem } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DataPanelProps {
  members: TeamMember[];
  onUpdateMembers: (members: TeamMember[]) => void;
  onReset: () => void;
}

export function DataPanel({ members, onUpdateMembers, onReset }: DataPanelProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    title: "",
    metrics: { velocity: 50, quality: 50, comms: 50, initiative: 50, delivery: 50 }
  });

  const selectedMember = members.find(m => m.id === selectedMemberId);

  const handleAddMember = () => {
    if (!newMember.name) return;
    const member: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMember.name || "New Member",
      title: newMember.title || "Developer",
      metrics: newMember.metrics as any,
      trend: [{ week: "W1", value: 50 }],
      tasks: [],
      schedule: []
    };
    onUpdateMembers([...members, member]);
    setNewMember({ name: "", title: "", metrics: { velocity: 50, quality: 50, comms: 50, initiative: 50, delivery: 50 } });
  };

  const handleDeleteMember = (id: string) => {
    onUpdateMembers(members.filter(m => m.id !== id));
    if (selectedMemberId === id) setSelectedMemberId(null);
  };

  const addTask = (memberId: string) => {
    const text = prompt("Enter task description:");
    if (!text) return;
    const priority = prompt("Enter priority (low, medium, high):") as any || "medium";
    const category = prompt("Enter category (e.g., Dev, Ops, Design):") || "General";

    const updatedMembers = members.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          tasks: [...(m.tasks || []), { id: Math.random().toString(36).substr(2, 9), text, completed: false, priority, category }]
        };
      }
      return m;
    });
    onUpdateMembers(updatedMembers);
  };

  const removeTask = (memberId: string, taskId: string) => {
    const updatedMembers = members.map(m => {
      if (m.id === memberId) {
        return { ...m, tasks: (m.tasks || []).filter(t => t.id !== taskId) };
      }
      return m;
    });
    onUpdateMembers(updatedMembers);
  };

  const addSchedule = (memberId: string) => {
    const time = prompt("Enter time (e.g. 09:00 AM):");
    if (!time) return;
    const title = prompt("Enter event title:");
    if (!title) return;
    const type = prompt("Enter type (meeting, focus, break, review):") as any || "focus";

    const updatedMembers = members.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          schedule: [...(m.schedule || []), { id: Math.random().toString(36).substr(2, 9), time, title, type }]
        };
      }
      return m;
    });
    onUpdateMembers(updatedMembers);
  };

  const removeSchedule = (memberId: string, scheduleId: string) => {
    const updatedMembers = members.map(m => {
      if (m.id === memberId) {
        return { ...m, schedule: (m.schedule || []).filter(s => s.id !== scheduleId) };
      }
      return m;
    });
    onUpdateMembers(updatedMembers);
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
        trend: [{ week: "W1", value: 50 }],
        tasks: [],
        schedule: []
      };
    });
    onUpdateMembers([...members, ...newOnes]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-headline">Team Data Management</h2>
          <p className="text-muted-foreground">Assign missions, schedules, and monitor performance</p>
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
        {/* Members List */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Squad Roster</CardTitle>
            <CardDescription>Select a member to manage their daily assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Missions</TableHead>
                  <TableHead>Avg</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map(member => {
                  const avg = Object.values(member.metrics).reduce((a, b) => (a as number) + (b as number), 0) / 5;
                  const isSelected = selectedMemberId === member.id;
                  return (
                    <TableRow 
                      key={member.id} 
                      className={cn(
                        "font-code text-sm cursor-pointer transition-colors",
                        isSelected ? "bg-primary/5" : "hover:bg-muted/50"
                      )}
                      onClick={() => setSelectedMemberId(member.id)}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold">{member.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">{member.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {(member.tasks || []).length} Tasks
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={avg > 80 ? "text-green-500 font-bold" : avg < 60 ? "text-red-500" : ""}>
                          {avg.toFixed(0)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => { e.stopPropagation(); setSelectedMemberId(member.id); }}
                          >
                            <UserCog className="w-4 h-4 text-primary" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => { e.stopPropagation(); handleDeleteMember(member.id); }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Panel */}
        <div className="space-y-6">
          {/* Detailed Editor (Tasks & Schedule) */}
          {selectedMember ? (
            <Card className="glass-card accent-line-top animate-in zoom-in-95 duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Managing: {selectedMember.name.split(' ')[0]}</span>
                  <Badge className="bg-primary">{selectedMember.title}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Task Assignment Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-primary" />
                      Daily Tasks
                    </Label>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => addTask(selectedMember.id)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <ScrollArea className="h-[150px] border rounded-md p-2 bg-muted/10">
                    <div className="space-y-2">
                      {(selectedMember.tasks || []).map(task => (
                        <div key={task.id} className="flex items-center justify-between p-2 rounded bg-card border text-[11px] group">
                          <span className="truncate flex-1 pr-2">{task.text}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeTask(selectedMember.id, task.id)}
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                      {(selectedMember.tasks || []).length === 0 && (
                        <p className="text-center py-8 text-[10px] text-muted-foreground italic">No tasks assigned</p>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Schedule Assignment Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-secondary" />
                      Daily Schedule
                    </Label>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => addSchedule(selectedMember.id)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <ScrollArea className="h-[150px] border rounded-md p-2 bg-muted/10">
                    <div className="space-y-2">
                      {(selectedMember.schedule || []).map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 rounded bg-card border text-[11px] group">
                          <div className="flex flex-col">
                            <span className="font-bold text-primary">{item.time}</span>
                            <span className="truncate">{item.title}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeSchedule(selectedMember.id, item.id)}
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                      {(selectedMember.schedule || []).length === 0 && (
                        <p className="text-center py-8 text-[10px] text-muted-foreground italic">No events scheduled</p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Add New Member</CardTitle>
                <CardDescription>Expand your squad rosters</CardDescription>
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
                <Button className="w-full mt-4" onClick={handleAddMember}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Member Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
