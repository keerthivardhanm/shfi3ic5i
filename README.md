# CrowdSafe 360° - Intelligent Crowd Management System

A comprehensive, real-time crowd management and safety monitoring platform designed for large-scale events. CrowdSafe 360° uses AI-powered analytics, live crowd density visualization, and automated alert systems to ensure the safety and smooth operation of events by preventing overcrowding and enabling quick emergency response.

## 🎯 Overview

CrowdSafe 360° is a web-based application that provides event administrators, organizers, volunteers, and audience members with real-time crowd monitoring, predictive analytics, and emergency management tools. The platform integrates Google Genkit AI for intelligent crowd predictions and uses Firebase for secure, scalable backend infrastructure.

**Application Name**: CrowdSafe 360°  
**Project Name**: flow-track  
**Status**: In Development (v0.1.0)

---

## ✨ Core Features

### 1. **Interactive Zone Mapping**
- Admins can create and manage event zones on an interactive map
- Adjustable capacity limits for each zone
- Dynamic zone merging and splitting during events
- Visual boundary representation on maps

### 2. **Real-time Crowd Density Visualization**
- Live color-coded heatmap displaying crowd density
- Dynamic updates on admin and organizer dashboards
- Zone-by-zone density monitoring
- Heat signature mode with simulated thermal visualization

### 3. **Automated Alert System**
- Overcrowding detection and alerts
- SOS signal management
- Push notifications to relevant personnel
- Alert categorization: High, Medium, Low priority
- Alert status tracking: Pending, Dispatched, Resolved

### 4. **Role-Based Access Control (RBAC)**
- **Admin**: Full system control, event creation, team management, advanced analytics
- **Organizer**: Event management, live monitoring, volunteer coordination
- **Volunteer**: Zone assignment, SOS response, task management
- **Audience**: SOS functionality, zone information, event participation

### 5. **Emergency SOS Functionality**
- Enable audience members to send SOS alerts with GPS location
- SOS clustering to automatically group nearby emergency events
- Direct dispatch to event organizers and administrators
- SOS incident reporting and tracking

### 6. **AI-Powered Predictive Analytics**
- Machine learning-based overcrowding predictions
- Crowd velocity and density analysis
- Proactive alerts based on predicted patterns
- AI-generated summaries of zone activity

### 7. **Comprehensive Reporting & Analytics**
- Zone-wise density reports
- SOS incident analysis
- Volunteer response time metrics
- Historical event data and trends
- Multi-metric KPI dashboards

### 8. **Advanced Features**
- **Geo-fence Alerts**: Alert if audience leaves allowed areas
- **Timelapse Playback**: Review crowd movement over time
- **Offline Fallback**: Offline mode for organizers with sync capability
- **Multi-event Management**: Create, switch, and monitor multiple events simultaneously
- **Live Crowd Demographics**: Track male/female ratios, crowd composition
- **Camera Feed Integration**: Real-time video monitoring capabilities

---

## 🏗️ Architecture & Technology Stack

### Frontend
- **Framework**: Next.js 15.3.8 (React 18.3)
- **Styling**: Tailwind CSS 3.4.1 with custom animations
- **UI Components**: Radix UI (accordion, dialogs, dropdowns, forms, etc.)
- **Charts & Visualization**: Recharts 2.15.1
- **Forms**: React Hook Form 7.54.2 with Zod validation
- **Icons**: Lucide React 0.475.0
- **State Management**: React Hooks with Firebase integration

### Backend & Services
- **Backend Framework**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Hosting**: Firebase App Hosting
- **AI/ML**: Google Genkit 1.20.0 with Google GenAI integration
- **Realtime Updates**: Firebase Firestore listeners

### Key Dependencies
```
@genkit-ai/google-genai: ^1.20.0 - AI predictions and summaries
@genkit-ai/next: ^1.20.0 - Next.js Genkit integration
firebase: ^11.9.1 - Backend services
face-api.js: ^0.22.2 - Face detection for crowd analytics
recharts: ^2.15.1 - Data visualization
```

---

## 📁 Project Structure

```
CROWDSAFFE 360/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── page.tsx                 # Home/redirect page
│   │   ├── login/page.tsx           # Login page
│   │   ├── admin/                   # Admin dashboard & management
│   │   │   ├── page.tsx             # Admin dashboard
│   │   │   ├── alerts/page.tsx      # Alert management
│   │   │   ├── events/page.tsx      # Event management
│   │   │   ├── monitoring/page.tsx  # Monitoring dashboard
│   │   │   ├── reports/page.tsx     # Reports & analytics
│   │   │   ├── team/page.tsx        # Team management
│   │   │   └── zones/page.tsx       # Zone configuration
│   │   ├── organizer/               # Organizer dashboard
│   │   │   ├── page.tsx             # Main organizer view
│   │   │   ├── camera-feed/page.tsx # Live camera monitoring
│   │   │   ├── chat/page.tsx        # Team communication
│   │   │   └── raise-ticket/page.tsx# Issue reporting
│   │   ├── volunteer/               # Volunteer interface
│   │   │   ├── page.tsx             # Volunteer tasks
│   │   │   └── layout.tsx           # Volunteer layout
│   │   ├── audience/page.tsx        # Audience member view
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   ├── components/                  # React components
│   │   ├── dashboard-components.tsx # Dashboard UI elements
│   │   ├── crowd-density-monitor.tsx# Density visualization
│   │   ├── map-view.tsx             # Interactive map
│   │   ├── read-only-map.tsx        # Map display component
│   │   ├── video-feed.tsx           # Video stream display
│   │   ├── analysis-results.tsx     # Analysis display
│   │   ├── input-source-selector.tsx# Input selection UI
│   │   ├── icons.tsx                # App icons
│   │   ├── zones/                   # Zone-specific components
│   │   │   └── zone-map-editor.tsx  # Zone creation/editing
│   │   └── ui/                      # Radix UI components
│   │       ├── accordion.tsx, alert.tsx, button.tsx, card.tsx
│   │       ├── dialog.tsx, form.tsx, input.tsx, table.tsx
│   │       ├── tabs.tsx, toast.tsx, etc.
│   ├── firebase/                    # Firebase configuration
│   │   ├── config.ts               # Firebase initialization
│   │   ├── auth.ts                 # Authentication utilities
│   │   ├── provider.tsx            # Firebase provider
│   │   ├── auth/use-user.tsx       # User hook
│   │   └── firestore/              # Firestore hooks
│   │       ├── use-collection.tsx  # Collection data hook
│   │       └── use-doc.tsx         # Document data hook
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-auth-guard.ts       # Auth protection hook
│   │   ├── use-mobile.tsx          # Mobile detection hook
│   │   └── use-toast.ts            # Toast notification hook
│   ├── lib/                         # Utilities & types
│   │   ├── types.ts                # TypeScript type definitions
│   │   ├── utils.ts                # Helper functions
│   │   ├── data.ts                 # Mock data
│   │   └── placeholder-images.ts   # Image utilities
│   ├── ai/                          # AI & Genkit integration
│   │   ├── genkit.ts               # Genkit configuration
│   │   ├── dev.ts                  # Development server
│   │   └── flows/                  # AI workflows
│   │       ├── generate-zone-summary.ts      # Zone summary generation
│   │       └── predict-overcrowding.ts      # Overcrowding prediction
│   └── middleware.ts               # Next.js middleware
├── public/                          # Static assets
│   └── zones-map.html              # Zone map resources
├── docs/                            # Documentation
│   ├── blueprint.md                # Feature & design blueprint
│   └── backend.json                # API documentation
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── postcss.config.mjs              # PostCSS configuration
├── apphosting.yaml                 # Firebase App Hosting config
├── firestore.rules                 # Firestore security rules
├── firestore.indexes.json          # Firestore index definitions
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **npm** or **yarn**: Package manager
- **Firebase Project**: Set up a Firebase project for authentication and Firestore
- **Google GenAI API Key**: For AI predictions and summaries
- **Google Cloud Project**: For Genkit AI integration

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/flow-track.git
   cd flow-track
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   
   # AI/Genkit Configuration
   GENKIT_API_KEY=your_google_genai_api_key
   GENKIT_MODEL=google-genai/gemini-2.0-flash
   ```

4. **Set up Firebase**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Firestore Database
   - Enable Firebase Authentication (Email/Password and Google)
   - Create Firestore security rules using `firestore.rules`
   - Set up Firestore indexes using `firestore.indexes.json`

5. **Configure Genkit AI**
   - Set up a Google Cloud project
   - Enable the Generative AI API
   - Create an API key and add it to your environment variables

### Running the Application

**Development Mode** (with Turbopack for fast builds):
```bash
npm run dev
# Application runs on http://localhost:9002
```

**Genkit AI Development** (for testing AI flows):
```bash
npm run genkit:dev
# Starts the Genkit development server
```

**Genkit AI Watch Mode** (for development with auto-reload):
```bash
npm run genkit:watch
```

**Production Build**:
```bash
npm run build
npm start
```

## 🎨 Design System

### Color Palette
- **Primary**: Electric Blue `#0066FF`
- **Secondary**: Emerald Green `#00C896`
- **Alert**: Red `#FF4D4D`
- **Warning**: Amber `#FFA600`
- **Neutral**: Gray `#E5E7EB`

### Typography
- **Font Family**: Inter (sans-serif)
- **Font Weights**: 
  - 400 (Body text)
  - 600 (Headings)
  - 700 (Titles)

### Responsive Design
- Fully responsive from mobile to desktop
- Adaptive grid system for maps, charts, and control panels
- Mobile-first design approach
- Touch-friendly interfaces

### Animation
- Lucide icons for consistent iconography
- Subtle map zone pulsing for density fluctuations
- Smooth transitions and interactions
- Toast notifications for user feedback

---

## 🔐 Security

### Firebase Security Rules
- Firestore rules are configured in `firestore.rules`
- Authentication required for all data access
- Role-based access control enforced at database level
- Real-time security updates

### Best Practices
- Environment variables for sensitive configuration
- Firebase Authentication for user management
- HTTPS only communication
- CORS protection
- Input validation with Zod

---

## 🧠 AI & Predictive Features

### Genkit AI Integration Overview

CrowdSafe 360° leverages **Google Genkit** with **Gemini 2.5 Flash** model for powerful AI-driven analysis and predictions. The AI system is designed to be intelligent, responsive, and production-ready with server-side execution (`'use server'` directive).

**Core AI Configuration** (`src/ai/genkit.ts`):
```typescript
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
```

The AI system provides two main workflows that work together to ensure event safety:

---

### 1. Overcrowding Prediction Flow

**File**: [src/ai/flows/predict-overcrowding.ts](src/ai/flows/predict-overcrowding.ts)

#### Purpose
Proactively identifies potential overcrowding situations before they occur, enabling preventive measures rather than reactive emergency responses.

#### Input Parameters
The flow accepts structured data about the zone's current state:

```typescript
{
  zoneId: string;                    // Unique identifier for the zone
  currentDensity: number;            // People per square meter (real-time metric)
  crowdVelocity: number;             // Average movement speed in meters per minute
  capacityLimit: number;             // Maximum safe capacity for the zone
  historicalData?: string;           // JSON string of historical density/velocity patterns
}
```

#### Processing Logic
The AI model analyzes:
1. **Rate of Density Increase**: How fast is the crowd growing?
2. **Crowd Flow Patterns**: Are there bottlenecks or areas of congestion?
3. **Proximity to Capacity**: How close is the current density to the zone's limit?
4. **Historical Trends**: What happened at similar density levels in the past?
5. **Velocity Patterns**: Is the crowd moving efficiently or stuck?

#### Output Analysis
```typescript
{
  isOvercrowdingPredicted: boolean;  // TRUE if overcrowding is likely
  predictionConfidence: number;      // 0-1 confidence score of the prediction
  timeToOvercrowding?: number;       // Minutes until critical density (if predicted)
  suggestedActions: string[];        // Actionable recommendations to prevent overcrowding
}
```

#### Real-World Example
**Scenario**: Main entrance zone at a concert

**Input**:
- Current Density: 4.2 people/m²
- Crowd Velocity: 0.3 m/min (slow, indicating congestion)
- Capacity Limit: 5000 people (5 people/m²)
- Historical Data: Shows similar density led to bottlenecks 30 mins ago

**AI Output**:
```json
{
  "isOvercrowdingPredicted": true,
  "predictionConfidence": 0.87,
  "timeToOvercrowding": 15,
  "suggestedActions": [
    "Increase security presence at entrances",
    "Redirect crowd flow to alternate entrances",
    "Close primary zone entrances temporarily",
    "Deploy staff to manage exit routes",
    "Issue public announcement to slow crowd entry"
  ]
}
```

#### How It Works in the System
1. **Real-time Monitoring**: Zone metrics are continuously collected from camera feeds and sensors
2. **API Integration**: Data is sent to the `predictOvercrowding()` function
3. **Analysis**: Genkit flow processes the data with Gemini AI
4. **Decision Making**: High confidence predictions (>0.75) trigger automatic alerts
5. **Action Dispatch**: Suggested actions are displayed to admins and organizers
6. **Feedback Loop**: Historical data is updated as predictions are validated

#### Integration Points
- Called from admin dashboard when monitoring zones
- Triggered automatically on configurable intervals (e.g., every 5 minutes)
- Can be invoked on-demand when density spikes
- Results cached for 2-3 minutes to avoid redundant processing

---

### 2. Zone Summary Generation Flow

**File**: [src/ai/flows/generate-zone-summary.ts](src/ai/flows/generate-zone-summary.ts)

#### Purpose
Generates human-readable, intelligent summaries of what happened in a specific zone during a time period, providing insights for post-event analysis and reporting.

#### Input Parameters
```typescript
{
  zoneId: string;         // The zone to analyze
  startTime: string;      // ISO 8601 format (e.g., "2026-02-01T14:00:00Z")
  endTime: string;        // ISO 8601 format (e.g., "2026-02-01T15:00:00Z")
}
```

#### Analysis Scope
The AI examines all events within the time period:
- **Crowd Density Fluctuations**: Peak densities, duration, patterns
- **SOS Incidents**: Number, location, types, resolution status
- **Alert History**: What alerts were triggered and why
- **Attendance Patterns**: Entry/exit flows, movement trends
- **Anomalies**: Unusual crowd behavior or incidents
- **Volunteer Activity**: Interventions and responses
- **System Events**: Zone merges, redirects, or closures

#### Output Format
```typescript
{
  summary: string;  // Natural language summary (500-1000 words typically)
}
```

#### Real-World Example
**Request**: Summarize Zone C (VIP Area) from 2:00 PM to 3:00 PM on Feb 1, 2026

**Generated Summary**:
```
Zone C (VIP Area) experienced moderate activity during the 1-hour period 
from 2:00 PM to 3:00 PM. The zone maintained a healthy crowd density, 
averaging 2.1 people per square meter, well below the 5 person/m² capacity limit.

Peak density occurred at 2:35 PM with 3.4 people/m², coinciding with the 
main stage performance. The crowd demonstrated orderly movement with an 
average velocity of 0.8 m/min, indicating smooth traffic flow.

Two SOS incidents were reported:
1. Medical assistance needed at 2:18 PM - resolved in 12 minutes
2. Lost child reported at 2:52 PM - reunited with guardians at 2:58 PM

Overall, Zone C operated smoothly with no overcrowding concerns. Volunteer 
response times averaged 3.2 minutes, exceeding the 5-minute target. No 
automatic alerts were triggered during this period.

Recommendation: Continue current volunteer staffing levels. Zone performed 
within optimal parameters.
```

#### Data Sources for Summaries
- **Firestore Collections**: 
  - `crowdData` - Historical density records
  - `sosReports` - Emergency incidents
  - `alerts` - System and manual alerts
  - `users` - Volunteer actions
- **Time-Series Data**: Density metrics sampled every 30 seconds
- **Event Logs**: All zone-related events with timestamps

#### Use Cases
1. **Post-Event Reporting**: Generate comprehensive reports for stakeholders
2. **Volunteer Debrief**: Summarize a shift's major incidents
3. **Compliance Documentation**: Create audit trails for safety reviews
4. **Performance Analysis**: Compare zones to identify best practices
5. **Media Brief**: Create public summaries of event operations

---

### Advanced Analytics Architecture

#### Data Pipeline
```
Sensors/Cameras
    ↓
Real-time Data Collection (live density, velocity, demographics)
    ↓
Firestore Storage (collections: crowdData, sosReports, alerts)
    ↓
AI Processing (Genkit flows)
    ↓
Insights & Predictions
    ↓
Dashboard Visualization & Alerts
```

#### Metrics Collected & Analyzed
| Metric | Unit | Frequency | Purpose |
|--------|------|-----------|---------|
| Current Density | people/m² | Real-time | Track overcrowding risk |
| Crowd Velocity | m/min | Every 30s | Detect congestion/flow issues |
| Entry Rate | people/min | Every 1 min | Predict future density |
| Exit Rate | people/min | Every 1 min | Understand zone dynamics |
| SOS Incidents | count | Real-time | Track emergencies |
| Alert Triggers | count | Real-time | Monitor system responsiveness |
| Volunteer Response Time | seconds | Per incident | Measure effectiveness |
| Zone Capacity Usage | percentage | Every 1 min | Prevent overcrowding |

#### Time-Series Data Storage
Crowd data is stored efficiently in Firestore with indexed timestamps for fast queries:
```typescript
crowdData collection:
{
  zoneId: string;
  timestamp: Timestamp;
  density: number;
  totalPeople: number;
  male: number;
  female: number;
  velocity: number;
  entryRate: number;
  exitRate: number;
}
```

#### Query Optimization
- **Indexes**: Firestore indexes on (zoneId, timestamp) for fast range queries
- **Aggregation**: Pre-compute hourly/daily summaries to reduce query load
- **Caching**: Recent summaries cached for 30 minutes
- **Pagination**: Large time ranges split into 1-hour chunks

---

### AI Model Details

#### Model: Gemini 2.5 Flash
- **Provider**: Google AI (via @genkit-ai/google-genai)
- **Characteristics**:
  - Fast inference (optimized for real-time responses)
  - Instruction-tuned for precise outputs
  - Supports structured JSON output (via Zod schemas)
  - Cost-effective for high-volume processing
  - Available globally with low latency

#### Error Handling & Fallbacks
- **API Failures**: Falls back to rule-based predictions
- **Rate Limiting**: Queues requests if quota exceeded
- **Timeout Protection**: 30-second timeout with graceful degradation
- **Retry Logic**: Automatic retry with exponential backoff

#### Cost Optimization
- **Batch Processing**: Groups multiple zone analyses
- **Caching**: Avoids re-analyzing unchanged zones
- **Throttling**: Limits flow invocations to necessary intervals
- **Model Selection**: Uses faster, cheaper Gemini Flash model

---

### Monitoring & Logging

#### AI Operation Metrics
The system tracks:
- **Flow Execution Time**: How long each flow takes to complete
- **Token Usage**: Input/output token counts for cost analysis
- **Success Rate**: Percentage of successful predictions
- **Confidence Scores**: Average prediction confidence
- **Error Rate**: Failed flows and error types
- **Cache Hit Rate**: Percentage of requests served from cache

#### Debug Logging
```typescript
// Logs include:
[PREDICT] Zone A: density=3.2, velocity=0.5 → overcrowding predicted (0.82 confidence)
[PREDICT] Zone B: density=1.8, velocity=2.1 → normal conditions (0.95 confidence)
[SUMMARY] Generated 847-word summary for Zone C (14:00-15:00)
```

---

### Future AI Enhancements

Planned improvements to the AI system:
1. **Multi-zone Correlation**: Analyze how crowd movements affect adjacent zones
2. **Predictive Surge Modeling**: Anticipate crowd surges from external events
3. **Anomaly Detection**: Identify unusual crowd behavior patterns
4. **Personalized Recommendations**: AI suggests actions based on historical effectiveness
5. **Fine-tuned Models**: Train custom models on historical event data
6. **Real-time Visualization**: AI generates visual heatmaps and flow diagrams
7. **Natural Language Queries**: Organizers ask natural questions about zones
8. **Integration with External Data**: Weather, social media sentiment, external events

---

## 📱 Role-Based Dashboards

### Admin Dashboard
- System overview with KPI metrics
- User and team management
- Event creation and configuration
- Zone management interface
- Analytics and reporting
- Alert management and monitoring
- Volunteer coordination
- Multi-event overview

**Key Pages**:
- `/admin` - Main dashboard
- `/admin/events` - Event management
- `/admin/zones` - Zone configuration
- `/admin/team` - Team management
- `/admin/alerts` - Alert management
- `/admin/monitoring` - Real-time monitoring
- `/admin/reports` - Reports & analytics

### Organizer Dashboard
- Event monitoring and control
- Live crowd density visualization
- Team communication (chat)
- Camera feed monitoring
- Ticket/issue management
- Volunteer task assignment

**Key Pages**:
- `/organizer` - Main dashboard
- `/organizer/camera-feed` - Live video monitoring
- `/organizer/chat` - Team communication
- `/organizer/raise-ticket` - Issue reporting

### Volunteer Interface
- Assigned zone information
- Task management
- SOS response coordination
- Live updates and notifications

**Key Pages**:
- `/volunteer` - Volunteer dashboard

### Audience Portal
- Event information
- SOS emergency button
- Zone information and navigation
- Live updates

**Key Pages**:
- `/audience` - Audience dashboard

---

## 🔌 API & Integration

### Firebase Firestore Collections
- `users` - User accounts and profiles
- `events` - Event information
- `zones` - Zone definitions and data
- `sosReports` - Emergency reports
- `alerts` - System and manual alerts
- `crowdData` - Live crowd metrics
- `predictions` - AI predictions
- `liveStream` - Video stream data

### Custom Hooks
- `useUser()` - Current authenticated user
- `useCollection()` - Query Firestore collection
- `useDoc()` - Query Firestore document
- `useAuthGuard()` - Protected route component
- `useMobile()` - Mobile device detection
- `useToast()` - Toast notifications

### Genkit AI API
- Access via `src/ai/genkit.ts`
- Flows defined in `src/ai/flows/`
- RESTful API endpoints for AI operations
- Real-time streaming responses

---

## 🛠️ Development Workflow

### Code Organization
- Component-based architecture
- Custom hooks for reusable logic
- Type-safe TypeScript throughout
- Firebase integration at service layer
- Modular CSS with Tailwind

### Adding New Features
1. Create UI components in `src/components/`
2. Add types to `src/lib/types.ts`
3. Create custom hooks in `src/hooks/`
4. Set up Firestore queries in component
5. Add Firebase security rules
6. Test with Firebase emulator

### Firebase Emulator (for local development)
```bash
firebase emulators:start
```

### Database Schema
- Firestore NoSQL structure
- Collections organized by entity type
- Subcollections for nested data
- Efficient indexing for queries
- Real-time listeners for updates

---

## 📈 Performance Optimization

- Next.js Turbopack for ultra-fast compilation
- Image optimization and lazy loading
- Code splitting by route
- Efficient Firestore queries with indexes
- Caching strategies for static data
- Firebase CDN for content delivery

---

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify Firebase config in `.env.local`
- Check Firestore security rules
- Ensure Firebase project is active
- Check network connectivity

### Genkit AI Errors
- Verify Google GenAI API key
- Check API quota and billing
- Review Genkit development server logs
- Test flows with `genkit start`

### Build Issues
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check Node.js version compatibility
- Verify TypeScript compilation

### Real-time Data Not Updating
- Check Firestore listener status
- Verify database rules allow reads
- Check network latency
- Review browser console for errors

---

## 📚 Documentation

- **Blueprint**: [docs/blueprint.md](docs/blueprint.md) - Feature specifications and design guidelines
- **Backend**: [docs/backend.json](docs/backend.json) - API documentation
- **Firestore Rules**: [firestore.rules](firestore.rules) - Database security
- **Firestore Indexes**: [firestore.indexes.json](firestore.indexes.json) - Query optimization

---

## 🤝 Contributing

When contributing to this project:
1. Follow the existing code structure
2. Use TypeScript for type safety
3. Write components as functional components with hooks
4. Add proper TypeScript types
5. Follow Tailwind CSS conventions
6. Test Firebase integration locally
7. Update documentation as needed

---

## 📄 License

[Add your license here]

---

## 🎓 Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Genkit Docs**: https://firebase.google.com/docs/genkit
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com
- **React Docs**: https://react.dev

---

## 📞 Contact & Feedback

For issues, feature requests, or feedback, please:
- Open an issue in the repository
- Contact the development team
- Review existing issues and discussions

---

## ✅ Checklist for Deployment

- [ ] Configure Firebase project with production settings
- [ ] Set up environment variables for production
- [ ] Enable HTTPS and security headers
- [ ] Configure Firestore indexes for all queries
- [ ] Set up Cloud Firestore backup
- [ ] Configure monitoring and logging
- [ ] Test all authentication flows
- [ ] Verify AI model API quotas
- [ ] Load test with expected user volume
- [ ] Plan disaster recovery and rollback procedures

---

**Last Updated**: February 1, 2026  
**Version**: 0.1.0
  
