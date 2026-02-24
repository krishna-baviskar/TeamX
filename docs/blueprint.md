# **App Name**: RoleBoard

## Core Features:

- Role Authentication & Management: Enables distinct Admin and Viewer login flows, with password-protected Admin access and personalized Viewer greetings. Manages role-based session state and displays current role status.
- Comprehensive Admin Data Panel: Provides administrators with tools to add, edit, or delete team members, input detailed metrics (velocity, quality, comms, initiative, delivery), manage time series data, and import data via CSV paste. Includes a 'Reset to demo data' option.
- Dynamic Chart Builder & Configuration: Allows admins to create new Recharts-powered data visualizations, select chart types, map data sources, configure axis, adjust chart sizes (1-col, 2-col, full-width), and set chart visibility for viewers.
- Admin Analytics Dashboard: Presents a full overview of all team members' data through an interactive grid of multiple chart types (Line, Bar, Area, Pie, Radar, Scatter), team-wide KPI summaries, a dynamic leaderboard, and anomaly highlights.
- Personalized Viewer Dashboard: Delivers a customized, read-only experience for viewers, showcasing their individual performance metrics, skill breakdowns via a radar chart, velocity trends, team rank, and limited team insights, all configured by the admin.
- Local State Persistence & Hydration: Automatically saves the entire application state (authentication, team data, chart configurations, and user settings) to localStorage on every change and restores it upon page load, ensuring data continuity without a backend.
- Customizable Application Settings: Grants admins control over global app settings, including toggling dark/light mode, selecting accent colors from preset swatches, setting dashboard and team titles, and defining which metrics and charts are visible to viewers.

## Style Guidelines:

- Default Background (Dark Mode): A deep charcoal blue (#080810), providing a high-contrast, immersive canvas for data visualization. Chosen to reflect a modern, professional, and tech-centric dashboard aesthetic.
- Alternative Background (Light Mode): A crisp, soft off-white (#F8F8FF) for an airy and clean interface, offering user choice and versatility for different environments.
- Primary Interactive Color: A vibrant orange (#F97316) for calls to action, key interactive elements, and primary data representation in charts. Selected for its energy and strong contrast against both light and dark backgrounds.
- Secondary Accent Color: A rich purple (#8B5CF6) used for complementary data series, specific highlight areas, and decorative UI elements. This hue adds depth and reinforces the dynamic, modern feel.
- Glassmorphism Card Style: Semi-transparent background elements with subtle blurring, creating a sophisticated layered effect. Cards feature a distinct colored top border, derived from the primary and secondary accent colors, for visual separation and flair.
- Headers: 'Syne' (sans-serif) via Google Fonts, for bold, impactful titles and headings that convey modern sophistication. Note: currently only Google Fonts are supported.
- Body Text & Data: 'IBM Plex Mono' (monospace) via Google Fonts, ideal for clear display of numerical data, metrics, and structured information, lending a technical and precise feel. Note: currently only Google Fonts are supported.
- Role Badges: Clearly distinguish between ADMIN (glowing red) and VIEWER (glowing green) roles in the header for immediate status identification. Utilize intuitive icons for data management (e.g., edit, delete, add) and chart configurations.
- Dual Experience Design: The Admin UI will have a 'power tool' density with more information and controls, while the Viewer UI will be cleaner, friendlier, and more spacious, focusing on personalized data and readability. Supports dynamic card resizing (1-col, 2-col, full-width) on dashboards.
- Subtle Interface Transitions: Implement smooth animated transitions between dashboard panels and views to enhance user experience. Animated number counters will be used for KPI cards, providing engaging feedback as data updates.