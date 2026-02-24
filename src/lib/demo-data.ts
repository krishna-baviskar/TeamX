import { RoleBoardState } from "@/types/dashboard";

export const INITIAL_STATE: RoleBoardState = {
  auth: {
    role: null,
    viewerName: "",
  },
  team: {
    members: [
      {
        id: "1",
        name: "Alex Johnson",
        title: "Lead Engineer",
        metrics: { velocity: 85, quality: 92, comms: 88, initiative: 95, delivery: 90 },
        trend: [
          { week: "W1", value: 75 },
          { week: "W2", value: 80 },
          { week: "W3", value: 85 },
          { week: "W4", value: 82 },
          { week: "W5", value: 90 },
        ]
      },
      {
        id: "2",
        name: "Sarah Chen",
        title: "Product Designer",
        metrics: { velocity: 78, quality: 95, comms: 90, initiative: 85, delivery: 82 },
        trend: [
          { week: "W1", value: 80 },
          { week: "W2", value: 82 },
          { week: "W3", value: 88 },
          { week: "W4", value: 92 },
          { week: "W5", value: 95 },
        ]
      },
      {
        id: "3",
        name: "Marcus Aurelius",
        title: "Backend Specialist",
        metrics: { velocity: 92, quality: 75, comms: 70, initiative: 80, delivery: 85 },
        trend: [
          { week: "W1", value: 95 },
          { week: "W2", value: 90 },
          { week: "W3", value: 85 },
          { week: "W4", value: 80 },
          { week: "W5", value: 75 }, // Anomaly: dropping
        ]
      },
      {
        id: "4",
        name: "Elena Rodriguez",
        title: "Frontend Developer",
        metrics: { velocity: 88, quality: 88, comms: 95, initiative: 90, delivery: 92 },
        trend: [
          { week: "W1", value: 70 },
          { week: "W2", value: 75 },
          { week: "W3", value: 82 },
          { week: "W4", value: 88 },
          { week: "W5", value: 92 },
        ]
      }
    ],
    announcements: [
      { id: "1", text: "Sprint 24 targets achieved!", date: "2024-03-20" },
      { id: "2", text: "New Quality Assurance metrics added.", date: "2024-03-18" },
      { id: "3", text: "Alex Johnson promoted to Lead Engineer!", date: "2024-03-15" }
    ]
  },
  charts: [
    { id: "c1", type: "radar", title: "Team Skill Map", size: "1-col", dataSource: "all", visibleToViewers: true },
    { id: "c2", type: "line", title: "Velocity Trend", size: "2-col", dataSource: "all", visibleToViewers: true },
    { id: "c3", type: "bar", title: "Member Quality Comparison", size: "1-col", dataSource: "all", visibleToViewers: true },
    { id: "c4", type: "pie", title: "Metric Distribution", size: "1-col", dataSource: "all", visibleToViewers: false }
  ],
  settings: {
    theme: "dark",
    accent: "#f97316",
    dashboardTitle: "RoleBoard Analytics",
    teamName: "Nexus Elite Squad",
    adminPassword: "admin123",
    showMemberNamesInViewerCharts: true,
    viewerVisibleMetrics: ["velocity", "quality", "comms"]
  }
};
