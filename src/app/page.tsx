
"use client";

import React, { useState, useEffect } from "react";
import { Login } from "@/components/RoleBoard/Login";
import { AppHeader } from "@/components/RoleBoard/AppHeader";
import { StatsCard } from "@/components/RoleBoard/StatsCard";
import { ChartContainer } from "@/components/RoleBoard/ChartContainer";
import { DataPanel } from "@/components/RoleBoard/DataPanel";
import { SettingsPanel } from "@/components/RoleBoard/SettingsPanel";
import { RoleBoardState, Role, TeamMember } from "@/types/dashboard";
import { INITIAL_STATE } from "@/lib/demo-data";
import { Users, Zap, Target, Star, AlertTriangle, TrendingUp } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function RoleBoardApp() {
  const [state, setState] = useState<RoleBoardState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMounted, setIsMounted] = useState(false);
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
          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg flex items-center gap-4 animate-bounce">
            <AlertTriangle className="text-destructive w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-destructive text-sm sm:text-base">Performance Anomaly Detected</p>
              <p className="text-xs text-muted-foreground">{anomalies[0].name}'s score dropped significantly this week.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ChartContainer title="Team Skill Aggregate" type="radar" data={radarData} size="1-col" />
          <ChartContainer title="Weekly Performance" type="line" data={state.team.members[0].trend} size="2-col" config={{ keys: ['value'] }} />
          <ChartContainer title="Performance Ranking" type="bar" data={memberCompData} size="2-col" />
          <ChartContainer title="Task Distribution" type="pie" data={memberCompData} size="1-col" />
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

    return (
      <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-5 duration-700">
        <div className="flex flex-col gap-1 px-1">
          <h2 className="text-2xl sm:text-4xl font-headline font-extrabold tracking-tighter">
            Welcome, <span className="text-primary">{viewerName}!</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-body">Here is your personal intelligence report.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard label="Avg Score" value={myAvg} suffix="%" icon={<Zap />} />
          <StatsCard label="Team Rank" value={myRank} suffix={`/${state.team.members.length}`} icon={<Users />} />
          <StatsCard label="Quality" value={currentMember.metrics.quality} suffix="%" icon={<Target />} />
          <StatsCard label="Growth" value={12} suffix="%" icon={<TrendingUp />} trend="up" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ChartContainer title="Your Professional Skill Map" type="radar" data={radarData} size="1-col" />
          <ChartContainer title="Personal Velocity Trend" type="area" data={currentMember.trend} size="2-col" />
          
          <div className="glass-card p-6 flex flex-col gap-4 md:col-span-2 lg:col-span-1">
            <h3 className="font-headline text-xl">Squad Feed</h3>
            <div className="space-y-4">
              {state.team.announcements.map(ann => (
                <div key={ann.id} className="border-l-2 border-primary/40 pl-4 py-1">
                  <p className="text-[10px] text-muted-foreground font-code mb-1">{ann.date}</p>
                  <p className="text-sm font-medium">{ann.text}</p>
                </div>
              ))}
            </div>
          </div>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
