export type Role = 'admin' | 'viewer' | null;

export interface Metrics {
  velocity: number;
  quality: number;
  comms: number;
  initiative: number;
  delivery: number;
}

export interface TrendPoint {
  week: string;
  value: number;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  metrics: Metrics;
  trend: TrendPoint[];
}

export interface Announcement {
  id: string;
  text: string;
  date: string;
}

export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'radar' | 'scatter';
export type ChartSize = '1-col' | '2-col' | 'full';

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  subtitle?: string;
  dataSource: 'all' | 'individual' | 'sprint' | 'category';
  size: ChartSize;
  visibleToViewers: boolean;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  accent: string;
  dashboardTitle: string;
  teamName: string;
  showMemberNamesInViewerCharts: boolean;
  viewerVisibleMetrics: string[];
}

export interface RoleBoardState {
  auth: {
    role: Role;
    viewerName: string;
  };
  team: {
    members: TeamMember[];
    announcements: Announcement[];
  };
  charts: ChartConfig[];
  settings: AppSettings;
}
