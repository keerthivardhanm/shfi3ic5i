# **App Name**: CrowdSafe 360°

## Core Features:

- Interactive Zone Mapping: Admins can create and manage event zones on an interactive map with adjustable capacity limits.
- Real-time Density Visualization: Display live crowd density via a color-coded heatmap on the admin and organizer dashboards, updating dynamically.
- Automated Alert System: Configure alerts triggered by overcrowding or SOS signals, dispatched via push notifications to relevant personnel.
- Role-Based Access Control: Implement role-specific dashboards and permissions for admins, organizers, volunteers, and audience members.
- SOS Functionality: Enable audience members to send SOS alerts with their precise location to event organizers and admins.
- Predictive Overcrowding Tool: Use a generative AI LLM, as a tool, to analyze crowd velocity and density to predict potential overcrowding and alert administrators.
- Reporting and Analytics: Generate reports on zone-wise density, SOS incidents, and volunteer response times.
- Geo-fence alerts: Alert if audience leaves the allowed area
- Zone merging & splitting: Dynamic zone editing during events
- Timelapse playback: Timelapse playback of crowd movement
- SOS Clustering: Automatically group nearby SOS events
- Offline fallback: Offline fallback mode for organizers (syncs when reconnected)
- Heat signature: Heat signature mode (simulated thermal density visualization)
- AI Summary Generator: AI Summary Generator (“Explain what happened in Zone C last hour.”)
- Multi-event management: Multi-event management (create, switch, and monitor multiple events)

## Style Guidelines:

- Primary: Electric Blue #0066FF
- Secondary: Emerald Green #00C896
- Alert Red #FF4D4D, Warning Amber #FFA600, Neutral Gray #E5E7EB
- Family: Inter (sans-serif)
- Weights: 400 (Body), 600 (Headings), 700 (Titles)
- Fully responsive: mobile → desktop
- Adaptive grid system for maps, charts, and control panels
- Universal icons (Lucide or Heroicons) for simplicity & accessibility
- Framer Motion for transitions
- Subtle map zone pulsing for density fluctuations