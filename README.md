# TeamX - Team Intelligence Dashboard

TeamX is a next-generation team performance intelligence engine designed to provide high-fidelity insights into squad operations and individual growth. It features a robust role-based access system, separating administrative oversight from personal productivity hubs.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/) (Radix UI primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: React Hooks + LocalStorage Persistence
- **Typography**: Syne (Headlines), Inter (Body), IBM Plex Mono (Data/Code)

## 🛡️ Role-Based Features

### 👑 Administrator Portal
The Admin view is designed for leadership oversight, resource allocation, and system configuration.

- **Intelligence Dashboard**:
    - **Aggregate Stats**: Real-time tracking of Team Velocity, Quality Benchmarks, and Top Performers.
    - **Skill Matrix (Radar)**: Visual aggregate of team strengths across five key dimensions.
    - **Workload Distribution**: Bar charts showing task loads and quality benchmarks across the squad.
    - **Role Insights**: Pie charts detailing the distribution of expertise (Engineering, Design, etc.).
- **Team Data Management**:
    - **Dynamic Roster**: Add or remove squad members instantly.
    - **Mission Assignment**: Directly assign daily tasks and priority missions to any team member.
    - **Schedule Pulse**: Manage individual daily timelines (Meetings, Focus Blocks, Reviews).
    - **Bulk Import**: Support for CSV data pasting for rapid team scaling.
- **System Settings**:
    - **Global Rebranding**: Customize dashboard titles and team identities.
    - **Visual Customization**: Toggle Dark/Light modes and choose between five high-contrast accent presets.
    - **Security**: Manage the administrative access password.
    - **Data Portability**: Export the entire application state to JSON for backup or migration.

### 👤 Team Viewer Dashboard
The Viewer view is a personalized "Operations Hub" focused on daily execution and personal growth.

- **Personal Analytics**:
    - **Performance Tracking**: Individual stats for Avg Score, Team Rank, and Growth trajectory.
    - **Visual Growth**: Personalized Skill Matrix and Velocity Trajectory charts.
- **Daily Operations**:
    - **Mission Checklist**: An interactive task list with progress tracking, priority badges (High/Medium/Low), and category tags.
    - **Self-Service Tasks**: Viewers can "Quick Add" their own daily objectives.
    - **Pulse Timeline**: A chronological vertical timeline of the day's events, from Standups to Focus blocks.
    - **Activity Mix**: Visual breakdown of how time is allocated (Meetings vs. Focus vs. Reviews).
- **Squad Intel**: A dedicated feed for team-wide announcements and milestones.

## 🎨 UI/UX Philosophy

- **Glass-morphism**: Modern UI using backdrop blurs and semi-transparent "Glass Cards."
- **Responsive Design**: Seamless experience across mobile, tablet, and desktop with a dedicated mobile navigation sheet for administrators.
- **Interactive Feedback**: Dynamic count-up animations for stats, hover-state transitions, and toast notifications for system actions.
- **High-Density Data**: Optimized layouts using IBM Plex Mono for numerical data to ensure readability at a glance.

## 🛠️ Getting Started

1. **Login**: Choose "Admin Portal" or "Team Viewer."
2. **Admin Access**: Use the configured password (default: `admin123`) to enter the management suite.
3. **Viewer Access**: Enter your name (e.g., "Alex Johnson") to sync with your assigned missions and stats.
4. **Data Management**: Use the "Team Data" tab as an Admin to start building your squad's missions.
