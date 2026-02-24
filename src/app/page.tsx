"use client";

import React, { useState, useEffect } from "react"; 
import { Login } from "@/components/RoleBoard/Login";
import { AppHeader } from "@/components/RoleBoard/AppHeader";
import { StatsCard } from "@/components/RoleBoard/StatsCard";
import { ChartContainer } from "@/components/RoleBoard/ChartContainer";
import { DataPanel } from "@/components/RoleBoard/DataPanel";
import { SettingsPanel } from "@/components/RoleBoard/SettingsPanel";
import { RoleBoardState, Role, TeamMember, Task, ScheduleItem } from "@/types/dashboard";
import { INITIAL_STATE } from "@/lib/demo-data";
import { Users, Zap, Target, Star, AlertTriangle, TrendingUp, CheckCircle2, Clock, Calendar, ChevronRight, Circle, BarChart3, PieChart as PieIcon, Plus, Send } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RoleBoardApp() {
  const [state, setState] = useState<RoleBoardState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMounted, setIsMounted] = useState(false);
  const [viewerNewTask, setViewerNewTask] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("roleboard_state");
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved state");
      }
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("roleboard_state", JSON.stringify(state));
      // Apply theme
      if (state.settings.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [state, isMounted]);

  const handleLogin = (role: Role, viewerName?: string) => {
    setState({ ...state, auth: { role, viewerName: viewerName || "" } });
    toast({ title: "Welcome back!", description: `Logged in as ${role === 'admin' ? 'Administrator' : viewerName}` });
  };

  const handleLogout = () => {
    setState({ ...state, auth: { role: null, viewerName: "" } });
    setActiveTab("dashboard");
  };

  const handleUpdateMembers = (members: TeamMember[]) => {
    setState({ ...state, team: { ...state.team, members } });
  };

  const handleUpdateSettings = (settings: any) => {
    setState({ ...state, settings });
  };

  const toggleTask = (memberId: string, taskId: string) => {
    const updatedMembers = state.team.members.map(m => {
      if (m.id === memberId && m.tasks) {
        return {
          ...m,
          tasks: m.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return m;
    });
    setState({ ...state, team: { ...state.team, members: updatedMembers } });
  };

  const handleViewerAddTask = (memberId: string) => {
    if (!viewerNewTask.trim()) return;
    
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      text: viewerNewTask,
      completed: false,
      priority: 'medium',
      category: 'Self'
    };

    const updatedMembers = state.team.members.map(m => {
      if (m.id === memberId) {
        return { ...m, tasks: [...(m.tasks || []), newTask] };
      }
      return m;
    });

    setState({ ...state, team: { ...state.team, members: updatedMembers } });
    setViewerNewTask("");
    toast({ title: "Mission Assigned", description: "You added a new task to your daily list." });
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "roleboard_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const resetToDemo = () => {
    setState({ ...INITIAL_STATE, auth: state.auth });
    toast({ title: "Demo data restored", description: "Application state reset to factory defaults." });
  };

  if (!isMounted) return null;

  if (!state.auth.role) {
    return <Login onLogin={handleLogin} correctAdminPassword={state.settings.adminPassword} />;
  }

  // --- Admin Views ---
  const renderAdminDashboard = () => {
    const avgVelocity = Math.floor(state.team.members.reduce((a, b) => a + b.metrics.velocity, 0) / state.team.members.length);
    const avgQuality = Math.floor(state.team.members.reduce((a, b) => a + b.metrics.quality, 0) / state.team.members.length);
    const topPerformer = [...state.team.members].sort((a, b) => 
      Object.values(b.metrics).reduce((x, y) => x + y, 0) - Object.values(a.metrics).reduce((x, y) => x + y, 0)
    )[0];

    const radarData = [
      { subject: 'Velocity', A: avgVelocity },
      { subject: 'Quality', A: avgQuality },
      { subject: 'Comms', A: Math.floor(state.team.members.reduce((a, b) => a + b.metrics.comms, 0) / state.team.members.length) },
      { subject: 'Initiative', A: Math.floor(state.team.members.reduce((a, b) => a + b.metrics.initiative, 0) / state.team.members.length) },
      { subject: 'Delivery', A: Math.floor(state.team.members.reduce((a, b) => a + b.metrics.delivery, 0) / state.team.members.length) },
    ];

    const memberCompData = state.team.members.map(m => ({ 
      name: m.name, 
      value: Math.floor(Object.values(m.metrics).reduce((a, b) => a + b, 0) / 5) 
    }));

    const taskDistribution = state.team.members.map(m => ({
      name: m.name,
      value: (m.tasks || []).length
    }));

    const qualityData = state.team.members.map(m => ({
      name: m.name.split(' ')[0],
      value: m.metrics.quality
    }));

    const roleDistribution = Array.from(new Set(state.team.members.map(m => m.title))).map(title => ({
      name: title,
      value: state.team.members.filter(m => m.title === title).length
    }));

    const anomalies = state.team.members.filter(m => {
      if (m.trend.length < 2) return false;
      const last = m.trend[m.trend.length - 1].value;
      const prev = m.trend[m.trend.length - 2].value;
      return last < prev * 0.8;
    });

    return (
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard label="Velocity" value={avgVelocity} suffix="%" icon={<Zap />} trend="up" />
          <StatsCard label="Quality" value={avgQuality} suffix="%" icon={<Target />} trend="neutral" />
          <StatsCard label="Team Size" value={state.team.members.length} suffix="" icon={<Users />} />
          <StatsCard label="Top Star" value={1} suffix={`: ${topPerformer?.name.split(' ')[0]}`} icon={<Star />} />
        </div>

        {anomalies.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg flex items-center gap-4 animate-pulse">
            <AlertTriangle className="text-destructive w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-destructive text-sm sm:text-base">Performance Anomaly Detected</p>
              <p className="text-xs text-muted-foreground">{anomalies[0].name}'s score dropped significantly this week.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ChartContainer title="Team Skill Aggregate" type="radar" data={radarData} size="1-col" />
          <ChartContainer title="Quality Benchmark" type="bar" data={qualityData} size="2-col" />
          <ChartContainer title="Performance Ranking" type="bar" data={memberCompData} size="2-col" />
          <ChartContainer title="Role Distribution" type="pie" data={roleDistribution} size="1-col" />
          <ChartContainer title="Task Load Distribution" type="bar" data={taskDistribution} size="2-col" />
          <ChartContainer title="Weekly Progress" type="area" data={state.team.members[0].trend} size="1-col" />
        </div>
      </div>
    );
  };

  // --- Viewer View ---
  const renderViewerDashboard = () => {
    const viewerName = state.auth.viewerName;
    const currentMember = state.team.members.find(m => m.name.toLowerCase().includes(viewerName.toLowerCase())) || state.team.members[0];

    const radarData = [
      { subject: 'Velocity', A: currentMember.metrics.velocity },
      { subject: 'Quality', A: currentMember.metrics.quality },
      { subject: 'Comms', A: currentMember.metrics.comms },
      { subject: 'Initiative', A: currentMember.metrics.initiative },
      { subject: 'Delivery', A: currentMember.metrics.delivery },
    ];

    const myAvg = Math.floor(Object.values(currentMember.metrics).reduce((a, b) => a + b, 0) / 5);
    const sortedMembers = [...state.team.members].sort((a, b) => 
      Object.values(b.metrics).reduce((x, y) => x + y, 0) - Object.values(a.metrics).reduce((x, y) => x + y, 0)
    );
    const myRank = sortedMembers.findIndex(m => m.id === currentMember.id) + 1;

    // Task Logic
    const tasks = currentMember.tasks || [];
    const completedTasks = tasks.filter(t => t.completed).length;
    const progressPercent = tasks.length > 0 ? Math.floor((completedTasks / tasks.length) * 100) : 0;

    // Category Chart Data
    const categoryCount: Record<string, number> = {};
    tasks.forEach(t => {
      categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
    });
    const categoryChartData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

    // Schedule Mix Data
    const scheduleCount: Record<string, number> = {};
    (currentMember.schedule || []).forEach(s => {
      scheduleCount[s.type] = (scheduleCount[s.type] || 0) + 1;
    });
    const scheduleChartData = Object.entries(scheduleCount).map(([name, value]) => ({ name, value }));

    return (
      <div className="space-y-6 sm:space-y-10 animate-in slide-in-from-bottom-5 duration-700">
        <div className="flex flex-col gap-1 px-1">
          <h2 className="text-2xl sm:text-4xl font-headline font-extrabold tracking-tighter">
            Welcome, <span className="text-primary">{viewerName}!</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-body">Your personal performance & daily operations hub.</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard label="Avg Score" value={myAvg} suffix="%" icon={<Zap />} />
          <StatsCard label="Team Rank" value={myRank} suffix={`/${state.team.members.length}`} icon={<Users />} />
          <StatsCard label="Quality" value={currentMember.metrics.quality} suffix="%" icon={<Target />} />
          <StatsCard label="Growth" value={12} suffix="%" icon={<TrendingUp />} trend="up" />
        </div>

        {/* Daily Operations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Visual Checklist */}
          <Card className="glass-card lg:col-span-2 border-l-4 border-l-primary/50 shadow-xl">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-4">
              <div className="space-y-1">
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Daily Mission Checklist
                </CardTitle>
                <p className="text-xs text-muted-foreground">Focus objectives for today</p>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input 
                  placeholder="New mission..." 
                  className="h-8 text-xs font-code max-w-[200px]" 
                  value={viewerNewTask}
                  onChange={(e) => setViewerNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleViewerAddTask(currentMember.id)}
                />
                <Button size="icon" className="h-8 w-8" onClick={() => handleViewerAddTask(currentMember.id)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={cn(
                      "group flex items-center justify-between p-3 rounded-lg transition-all border border-transparent",
                      task.completed ? "bg-muted/30 opacity-60" : "bg-card hover:border-primary/20 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={task.completed} 
                        onCheckedChange={() => toggleTask(currentMember.id, task.id)}
                        className="w-5 h-5 rounded-md"
                      />
                      <div className="flex flex-col">
                        <span className={cn("text-sm font-medium", task.completed && "line-through")}>
                          {task.text}
                        </span>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[9px] font-code uppercase px-1.5 py-0.5 bg-muted rounded">
                            {task.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'} className="text-[9px] uppercase h-5">
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="col-span-2 text-center py-8 text-muted-foreground italic">No tasks assigned for today.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Visual Schedule Timeline */}
          <Card className="glass-card flex flex-col h-full border-l-4 border-l-secondary/50 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary" />
                Daily Pulse
              </CardTitle>
              <p className="text-xs text-muted-foreground">Timeline of scheduled blocks</p>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[400px]">
              <div className="relative space-y-4 pt-2">
                <div className="absolute left-[11px] top-6 bottom-4 w-px bg-border" />
                
                {currentMember.schedule?.map((item, idx) => (
                  <div key={item.id} className="relative pl-8 group">
                    <div className={cn(
                      "absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 bg-background flex items-center justify-center z-10 transition-transform group-hover:scale-110",
                      item.type === 'meeting' ? "border-red-500" :
                      item.type === 'focus' ? "border-primary" :
                      item.type === 'review' ? "border-secondary" : "border-muted-foreground"
                    )}>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        item.type === 'meeting' ? "bg-red-500" :
                        item.type === 'focus' ? "bg-primary" :
                        item.type === 'review' ? "bg-secondary" : "bg-muted-foreground"
                      )} />
                    </div>
                    
                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/20 border border-transparent hover:border-border transition-all">
                      <span className="text-[10px] font-bold font-code text-muted-foreground">{item.time}</span>
                      <span className="text-sm font-semibold">{item.title}</span>
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground opacity-70">{item.type}</span>
                    </div>
                  </div>
                ))}
                {(!currentMember.schedule || currentMember.schedule.length === 0) && (
                  <p className="text-center py-8 text-muted-foreground italic">Clear schedule today.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ChartContainer title="Skill Matrix" type="radar" data={radarData} size="1-col" />
          <ChartContainer title="Task Categories" type="bar" data={categoryChartData} size="1-col" />
          <ChartContainer title="Activity Mix" type="pie" data={scheduleChartData} size="1-col" />
          <ChartContainer title="Velocity Trajectory" type="area" data={currentMember.trend} size="2-col" />
          
          <Card className="glass-card md:col-span-1 lg:col-span-1 border-t-4 border-t-primary/30">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Squad Intel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.team.announcements.map(ann => (
                <div key={ann.id} className="border-l-2 border-primary/40 pl-4 py-2 hover:bg-muted/10 transition-colors rounded-r-md">
                  <p className="text-[10px] text-muted-foreground font-code mb-1">{ann.date}</p>
                  <p className="text-sm font-medium">{ann.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <AppHeader 
        role={state.auth.role} 
        name={state.auth.viewerName} 
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        title={state.settings.dashboardTitle}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {state.auth.role === 'admin' ? (
          <>
            {activeTab === 'dashboard' && renderAdminDashboard()}
            {activeTab === 'data' && (
              <DataPanel 
                members={state.team.members} 
                onUpdateMembers={handleUpdateMembers} 
                onReset={resetToDemo} 
              />
            )}
            {activeTab === 'settings' && (
              <SettingsPanel 
                settings={state.settings} 
                onUpdateSettings={handleUpdateSettings} 
                onExport={handleExport}
              />
            )}
          </>
        ) : (
          renderViewerDashboard()
        )}
      </main>
      <Toaster />
    </div>
  );
}
