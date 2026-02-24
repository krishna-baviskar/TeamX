"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartSize } from "@/types/dashboard";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  type: string;
  data: any[];
  size?: ChartSize;
  config?: any;
}

export function ChartContainer({ title, subtitle, type, data, size = "1-col", config }: ChartContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg" />;

  const sizeClass = {
    "1-col": "col-span-1",
    "2-col": "col-span-1 md:col-span-2",
    "full": "col-span-1 md:col-span-3",
  };

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} />
            <Legend verticalAlign="top" height={36} />
            {config?.keys?.map((key: string, idx: number) => (
              <Line key={key} type="monotone" dataKey={key} stroke={idx === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))"} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        );
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--secondary))" fillOpacity={0.3} fill="hsl(var(--secondary))" />
          </AreaChart>
        );
      case "pie":
        const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#ffc658', '#8884d8', '#82ca9d'];
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case "radar":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#666' }} />
            <Radar
              name="Team Avg"
              dataKey="A"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.4}
            />
            <Tooltip />
          </RadarChart>
        );
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <Card className={cn("glass-card overflow-hidden", sizeClass[size])}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-headline">{title}</CardTitle>
        {subtitle && <CardDescription className="text-xs">{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[300px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
